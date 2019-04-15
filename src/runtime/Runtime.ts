/**
 * @author Daniel Salomon
 */
import { Raycaster, Vector3, WebGLRenderer, Object3D, Mesh, Box3 } from "three";
import GamepadListener from "../input/GamepadListener";
import KeyboardListener from "../input/KeyboardListener";
import Project from "../project/Project";
import GameObject from "../project/GameObject";

const axes = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1)
};

export default class Runtime {
  target: HTMLElement | null = null;
  project: Project;

  rafHandle = 0;
  previousTimestamp = 0;
  playerHeight = 1.8; //1,80m player height, eyes are ~10cm lower
  lastCollisionSound = 0; //Timestamp, when the last sound for collision was played
  lastKnownButtonStatus = false; //Variable to check whether or not the button[0] was pressed in the last update() or not (to prevent multiple clicks)

  shouldRender = true; //Should the visuals be rendered or should it be audio-only?

  renderer = new WebGLRenderer();
  canvas: HTMLCanvasElement;

  raycaster = new Raycaster();

  dummyCamera = new Object3D();

  keys = new KeyboardListener(this.renderer.domElement);
  gamepads = new GamepadListener();

  constructor(project: Project) {
    this.project = project;
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = -1; // Make element focusable

    this.project.selectRoom(this.project.rooms[0]);
    this.project.camera.position.set(0, this.playerHeight - 0.1, 2);
    this.project.camera.rotation.set(0, 0, 0);
  }

  attach(target: HTMLElement): void {
    this.keys.listen();
    this.gamepads.listen();

    this.target = target;
    target.appendChild(this.canvas);

    this.resize();
    window.requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
  }

  detach(): void {
    window.cancelAnimationFrame(this.rafHandle);
    window.removeEventListener("resize", this.resize);

    if (this.target) {
      this.target.removeChild(this.canvas);
      this.target = null;
    }

    this.keys.stop();
    this.gamepads.stop();
  }

  focus(): void {
    this.canvas.focus();
  }

  resize = (): void => {
    if (!this.target) {
      return;
    }

    const { offsetWidth, offsetHeight } = this.target;

    this.project.camera.aspect = offsetWidth / offsetHeight;
    this.project.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(offsetWidth, offsetHeight);
  };

  animate: FrameRequestCallback = t => {
    this.rafHandle = window.requestAnimationFrame(this.animate);

    const dt = (t - this.previousTimestamp) / 1000;
    this.previousTimestamp = t;
    this.update(dt);

    if (this.shouldRender) {
      this.renderer.render(this.project.activeRoom, this.project.camera);
    } else {
      // When we are not actively rendering, position updates are not passed down
      // to children in the scene graph automatically.
      // To enforce this update, we have to update the scene graphs root manually
      // (i.e., the scene itself), which will in turn update all nodes contained in the
      // scene graph.
      // As the camera is not a part of the scene graph, it has to be updated
      // manually as well.
      this.project.activeRoom.updateMatrixWorld();
      this.project.activeRoom.camera.updateMatrixWorld(false);
    }
  };

  toggleRendering(): void {
    this.shouldRender = this.shouldRender ? false : true;
    this.renderer.clear();
  }

  // Helper method to check if a number (check) is between or equal to two boundaries (from, to). E.g.: isBetween(2, 1, 5)==true, isBetween(6, 1, 5)==false
  isBetween(check: number, from: number, to: number): boolean {
    const min = Math.min.apply(Math, [from, to]),
      max = Math.max.apply(Math, [from, to]);
    return check >= min && check <= max;
  }

  invokeInteraction(): boolean {
    const toInteractWith = this.project.activeObject;
    if (toInteractWith != null) {
      toInteractWith.rotateX(0.1); //TODO - Invoke interaction method on object (not implemented yet)
      return true;
    } else {
      return false;
    }
  }

  update(dt: number): void {
    const { camera } = this.project;
    this.dummyCamera.position.copy(camera.position); //Copy values of the real camera object to the dummy camera, to be used later on for collision detection
    this.dummyCamera.rotation.copy(camera.rotation);

    let moveX = 0;
    let moveZ = 0;
    let rotateY = 0;

    //Sidenote on movement: We really wanted to implement the possibility to look up and down, but it turned out to be way too complex for us to implement in this project.
    //All tries resulted in either a buggy camera or a buggy movement through the environment, which we were not fine with.

    //Keyboard actions (W/A/S/D to move, Left&Right arrows to rotate)
    if (this.keys.isPressed("w")) {
      const newZ = -2 * dt;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (this.keys.isPressed("s")) {
      const newZ = 2 * dt;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (this.keys.isPressed("a")) {
      const newX = -2 * dt;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }
    if (this.keys.isPressed("d")) {
      const newX = 2 * dt;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }

    if (this.keys.isPressed("ArrowLeft")) {
      const newY = dt;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }
    if (this.keys.isPressed("ArrowRight")) {
      const newY = -dt;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }

    //Collect necessary information from the gamepad API, supports analog sticks (slower and faster movement)
    const gamepadAxes = {
      x: this.gamepads.getAxis(0),
      y: this.gamepads.getAxis(1),
      rX: this.gamepads.getAxis(2)
    };
    if (gamepadAxes.x) {
      const newX = 2 * dt * gamepadAxes.x;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }
    if (gamepadAxes.y) {
      const newZ = 2 * dt * gamepadAxes.y;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (gamepadAxes.rX) {
      const newY = -dt * gamepadAxes.rX;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }

    // Executing the rotation/movement after all keys are evaluated prevents the issue of double movement speed when both, keyboard and gamepad, is used at the same time.
    camera.rotateOnWorldAxis(axes.y, rotateY); // Rotate left & right
    //Apply movement to dummy object first to check if a collision is happening. If not, apply to actual camera.
    this.dummyCamera.translateOnAxis(axes.z, moveZ); // Move forwards & backwards
    this.dummyCamera.translateOnAxis(axes.x, moveX); // Move left & right

    //Values to check for collision
    const newX = this.dummyCamera.position.x;
    const newZ = this.dummyCamera.position.z;

    //Check for collision
    let collided = false;
    for (const i of this.project.activeRoom.children) {
      if (!(i instanceof Mesh)) {
        continue;
      }
      const thresholdMovement = 0.25; //Minimum allowed distance to an object
      const thresholdHeight = 0.05; //Minimum allowed distance to an object below or above the player (player height is 1,80[m])

      var bbox = new Box3().setFromObject(i); //Bounding box to take rotation of the object into account.
      const bboxposition = bbox.getCenter(new Vector3());
      const bboxscale = bbox.getSize(new Vector3());

      //Estimate boundaries of all (visible) objects in the current room
      const boundX1 = bboxposition.x + bboxscale.x / 2 + thresholdMovement;
      const boundX2 = bboxposition.x - bboxscale.x / 2 - thresholdMovement;
      const boundY1 = bboxposition.y + bboxscale.y / 2 + thresholdHeight;
      const boundY2 = bboxposition.y - bboxscale.y / 2 - thresholdHeight;
      const boundZ1 = bboxposition.z + bboxscale.z / 2 + thresholdMovement;
      const boundZ2 = bboxposition.z - bboxscale.z / 2 - thresholdMovement;

      //Check if the next position of the camera collides with the bondaries or the object (and effectively if a collision is about to happen)
      if (
        this.isBetween(newX, boundX2, boundX1) &&
        this.isBetween(newZ, boundZ2, boundZ1) &&
        (this.isBetween(boundY1, 0, this.playerHeight) ||
          this.isBetween(boundY2, 0, this.playerHeight) ||
          (this.isBetween(this.playerHeight, boundY2, boundY1) &&
            this.isBetween(0, boundY2, boundY1)))
      ) {
        collided = true;
      }
    }

    // Move to new position if no collision occured, otherwise play a collision sound
    if (!collided) {
      camera.position.copy(this.dummyCamera.position);
    } else if (this.lastCollisionSound + 1000 < Date.now()) {
      //TODO - Play sound
      this.lastCollisionSound = Date.now();
    }

    //Check for an object to interact with. If found, mark it as active (mostly for debugging and visual help for possible spectators)
    //The raycaster helps to check for objects in sight. To ensure that objects on the bottom and top of sight are interactable too, the raycasting is called multiple times
    //That way, objects from the middle top of the sight to the middle bottom of the screen are scanned and checked for their distance.
    let nearestDist = Infinity;
    let nearestObj: GameObject | null = null;

    for (let i = 1; i >= -1; i -= 0.1) {
      //From top (1) to middle(0) to bottom (-1)
      this.raycaster.setFromCamera({ x: 0, y: i }, camera);
      const intersections = this.raycaster.intersectObjects(
        //perform raycasting with the given settings, originating from the main camera
        this.project.activeRoom.children
      );

      for (const intersection of intersections) {
        //Check, if the intersecting objects are actual GameObjects and if they are closer than the current closest intersecting GameObject
        const o = intersection.object;
        if (o instanceof GameObject && intersection.distance < nearestDist) {
          nearestDist = intersection.distance;
          nearestObj = o;
        }
      }
    }

    if (nearestDist <= 1.5 && nearestObj != null) {
      //If the clostest GameObject is closer or equal than 1.5m (and not null for safety), select it
      this.project.selectObject(nearestObj);
    } else {
      //Otherwise, unselect all
      this.project.selectObject(null);
    }

    //Interact with nearest (selected) object
    if (
      // Is the button or key clicked
      (this.gamepads.getButtonStatus(0) || this.keys.isPressed("e")) &&
      //Prevent multiple actions on button hold
      !this.lastKnownButtonStatus
    ) {
      this.lastKnownButtonStatus = true;
      this.invokeInteraction();
    } else if (!this.gamepads.getButtonStatus(0) && !this.keys.isPressed("e")) {
      this.lastKnownButtonStatus = false; //Last known button status was unpressed, so clear the value
    }

    //TODO - sounds for footsteps
  }
}
