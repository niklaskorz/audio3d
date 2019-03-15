/**
 * @author Niklas Korz
 */
import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  Vector3
} from "three";

// The object drag direction is required for calculating the plane to ray cast
// against later on. Also, of course, to determine whether the object should be
// moved on one or two axes.
export enum ObjectDragDirection {
  AxisX,
  AxisY,
  AxisZ,
  PlaneYZ,
  PlaneXZ,
  PlaneXY
}

// Inspired by https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TransformControls.js:
// As in the example, we are using ray casting for calculating the movements of planes and axes.
// Everything else in this implementation has resulted either from trial and error or by
// consulting the Three.js documentation.
// The controls are grouped as a scene instead of a group object to allow drawing
// them separately, on top of the main scene, to avoid any controls to be obscured
// by objects that would theoretically appear in front of them based on their Z coordinate.
// Furthermore, the scene's position is set to the active mesh's when one is
// selected. This way, coordinates in the controls scene are always relative to the
// active mesh.
// Theoretically, it could also be added as a child node to the active mesh,
// but this would result in the rotation being copied as well, which is not desirable
// in this case.
// Beware though that intersection points are always given in absolute world coordinates.
export default class ControlsScene extends Scene {
  activeMesh: Mesh | null = null;
  objectDragDirection: ObjectDragDirection | null = null;
  dragOffset = new Vector3();

  // As in the Three.js example, we will be using a _really_ long and wide plane
  // geometry to ensure the casted ray will hit it.
  // While the THREE.Plane class looks more suitable at first, it does not support
  // casting rays against it and will therefore not work with the chosen approach.
  // I have tried combining it with Three.PlaneHelper, but this has resulted in
  // unexpected behavior.
  plane = new Mesh(
    new PlaneBufferGeometry(100000, 100000, 2, 2),
    new MeshBasicMaterial({
      transparent: true,
      opacity: 0.25,
      side: DoubleSide
    })
  );

  // The visual controls
  axisX: Mesh;
  axisY: Mesh;
  axisZ: Mesh;
  planeYZ: Mesh;
  planeXZ: Mesh;
  planeXY: Mesh;

  constructor() {
    super();

    // Setup visual controls for transformation

    // The X, Y and Z axes, represented as cuboids

    const axisGeometry = new BoxGeometry(0.05, 0.05, 0.5);

    this.axisX = new Mesh(
      axisGeometry,
      new MeshBasicMaterial({ color: 0xff0000 })
    );
    this.axisX.position.set(0.25, 0.0, 0.0);
    this.axisX.rotation.y = Math.PI / 2;
    this.axisX.userData.direction = ObjectDragDirection.AxisX;

    this.axisY = new Mesh(
      axisGeometry,
      new MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.axisY.position.set(0.0, 0.25, 0.0);
    this.axisY.rotation.x = Math.PI / 2;
    this.axisY.userData.direction = ObjectDragDirection.AxisY;

    this.axisZ = new Mesh(
      axisGeometry,
      new MeshBasicMaterial({ color: 0x0000ff })
    );
    this.axisZ.position.set(0.0, 0.0, 0.25);
    this.axisZ.userData.direction = ObjectDragDirection.AxisZ;

    this.add(this.axisX);
    this.add(this.axisY);
    this.add(this.axisZ);

    // The YZ, XZ, XY planes, represented as... planes. :)
    // Declaration is ordered by the normal of the plane, i.e.
    // the axis that will not be moved by it.

    const planeGeometry = new PlaneGeometry(0.25, 0.25);

    this.planeYZ = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0x00ffff, side: DoubleSide })
    );
    this.planeYZ.position.set(0.0, 0.25, 0.25);
    this.planeYZ.rotation.y = Math.PI / 2;
    this.planeYZ.userData.direction = ObjectDragDirection.PlaneYZ;

    this.planeXZ = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0xff00ff, side: DoubleSide })
    );
    this.planeXZ.position.set(0.25, 0.0, 0.25);
    this.planeXZ.rotation.x = Math.PI / 2;
    this.planeXZ.userData.direction = ObjectDragDirection.PlaneXZ;

    this.planeXY = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })
    );
    this.planeXY.position.set(0.25, 0.25, 0.0);
    this.planeXY.userData.direction = ObjectDragDirection.PlaneXY;

    this.add(this.planeYZ);
    this.add(this.planeXZ);
    this.add(this.planeXY);

    this.add(this.plane);
  }

  // As we don't have access to the camera here and to avoid creating the ray caster
  // twice, we just pass it from the initial mouse click handler and use it here.
  // The original mouse event and screen coordinates are not required for the functionality
  // of the controls, so they will not be taken as parameters here.
  onClick(raycaster: Raycaster): boolean {
    if (!this.activeMesh) {
      return false;
    }

    this.position.copy(this.activeMesh.position);

    const intersections = raycaster.intersectObjects(this.children);
    for (const intersection of intersections) {
      const o = intersection.object;
      if (o.userData.hasOwnProperty("direction")) {
        this.objectDragDirection = o.userData.direction;
        this.dragOffset.copy(intersection.point).sub(this.activeMesh.position);

        this.onMove(raycaster);
        return true;
      }
    }
    return false;
  }

  // Initially, I used a Vector3(dx, dy, 0) here and applied the world rotation
  // that can be calculated by the camera with camera.getWorldQuaternion(),
  // followed by zeroing out the directions that should not be changed based on
  // the plane or axis selected by the user.
  // This resulted in a "weird" feeling though, as the zeroed axis gets completely lost,
  // therefore making one of the two remaining axis movements feel slower than the other
  // even if both are dragged equally on the screen.
  //
  // Similar to the Three.js transform controls example, this now uses a ray
  // casted from the camera origin onto a plane that represents the axes to move
  // on and sets the position of the object to the intersection point.
  onMove(raycaster: Raycaster): void {
    if (this.objectDragDirection === null || !this.activeMesh) {
      return;
    }

    this.position.copy(this.activeMesh.position);

    // Update the rotation of the intersection plane according to the dragged
    // axis or plane.
    switch (this.objectDragDirection) {
      case ObjectDragDirection.AxisX:
      case ObjectDragDirection.PlaneXY:
        this.plane.rotation.set(0, 0, 0);
        break;
      case ObjectDragDirection.AxisY:
      case ObjectDragDirection.PlaneYZ:
        this.plane.rotation.set(0, Math.PI / 2, 0);
        break;
      case ObjectDragDirection.AxisZ:
      case ObjectDragDirection.PlaneXZ:
        this.plane.rotation.set(Math.PI / 2, 0, 0);
        break;
    }

    const intersections = raycaster.intersectObject(this.plane);
    if (!intersections.length) {
      // No intersections found
      // Theoretically, this should not happen
      return;
    }
    // The first intersection is the closest
    const intersection = intersections[0];
    intersection.point.sub(this.dragOffset);

    // If we are operating on an axis instead of a plane, ensure only the relevant
    // coordinate is changed.
    switch (this.objectDragDirection) {
      case ObjectDragDirection.AxisX:
        this.activeMesh.position.x = intersection.point.x;
        break;
      case ObjectDragDirection.AxisY:
        this.activeMesh.position.y = intersection.point.y;
        break;
      case ObjectDragDirection.AxisZ:
        this.activeMesh.position.z = intersection.point.z;
        break;
      default:
        // The selected direction is a plane, so we can just copy the
        // intersection point.
        this.activeMesh.position.copy(intersection.point);
    }
  }
}
