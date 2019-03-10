import * as React from "react";
import styled from "styled-components";
import {
  ArrowHelper,
  BackSide,
  BoxGeometry,
  BoxHelper,
  Color,
  DoubleSide,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PlaneHelper,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import KeyboardListener from "./KeyboardListener";

enum MouseButton {
  Primary = 0,
  Middle = 1,
  Secondary = 2
}

const directions = {
  up: new Vector3(0, 1, 0),
  down: new Vector3(0, -1, 0),
  left: new Vector3(-1, 0, 0),
  right: new Vector3(1, 0, 0),
  forwards: new Vector3(0, 0, -1),
  backwards: new Vector3(0, 0, 1)
};

// Circular position based on timestamp
const f = (time: number, orbitalPeriod: number, radius: number) =>
  new Vector3(
    radius * Math.sin((time / orbitalPeriod) * 2 * Math.PI),
    0.5,
    radius * Math.cos((time / orbitalPeriod) * 2 * Math.PI)
  );

export default class SceneCanvas {
  target: HTMLElement | null = null;

  rafHandle = 0;
  previousTimestamp = 0;

  activeMesh: Mesh | null = null;

  scene = new Scene();
  controlsScene = new Scene();
  camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new WebGLRenderer();
  canvas: HTMLCanvasElement;
  grid = new GridHelper(10, 10);
  smallCube = new Mesh();
  outlineMesh = new Mesh();

  arrows = new Group();

  keys = new KeyboardListener();
  isDraggingCamera = false;

  constructor() {
    this.renderer.autoClear = false;
    this.canvas = this.renderer.domElement;
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("wheel", this.onWheel);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener(
      "contextmenu",
      e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      true
    );

    const geometry = new BoxGeometry(1, 1, 1);
    /* const material = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    }); */
    const material = new MeshNormalMaterial();
    const cube = new Mesh(geometry, material);
    cube.position.y += 0.5;

    this.smallCube.geometry = new BoxGeometry(0.25, 0.25, 0.25);
    this.smallCube.material = material;

    const arrowX = new ArrowHelper(new Vector3(1, 0, 0));
    arrowX.setColor(new Color(0xff0000));
    const arrowY = new ArrowHelper(new Vector3(0, 1, 0));
    arrowY.setColor(new Color(0x00ff00));
    const arrowZ = new ArrowHelper(new Vector3(0, 0, 1));
    arrowZ.setColor(new Color(0x0000ff));

    const planeGeometry = new PlaneGeometry(0.25, 0.25);
    const planeXY = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })
    );
    planeXY.position.set(0.25, 0.25, 0.0);
    const planeXZ = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0xff00ff, side: DoubleSide })
    );
    planeXZ.position.set(0.25, 0.0, 0.25);
    planeXZ.rotation.x = Math.PI / 2;
    const planeYZ = new Mesh(
      planeGeometry,
      new MeshBasicMaterial({ color: 0x00ffff, side: DoubleSide })
    );
    planeYZ.position.set(0.0, 0.25, 0.25);
    planeYZ.rotation.y = Math.PI / 2;

    this.arrows = new Group();

    this.arrows.add(arrowX);
    this.arrows.add(arrowY);
    this.arrows.add(arrowZ);

    this.arrows.add(planeXY);
    this.arrows.add(planeXZ);
    this.arrows.add(planeYZ);

    this.controlsScene.add(this.arrows);

    this.scene.add(cube);
    this.scene.add(this.smallCube);
    this.scene.add(this.grid);

    this.camera.position.z = 3;
    this.camera.position.y = 1;
    this.camera.lookAt(cube.position);

    const outlineMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      side: BackSide
    });
    this.outlineMesh.material = outlineMaterial;
    this.outlineMesh.scale.multiplyScalar(1.05);

    console.log(this.scene.toJSON());
  }

  attach(target: HTMLElement): void {
    this.keys.listen();
    this.target = target;
    target.appendChild(this.canvas);

    this.resize();
    this.animate(0);
    window.addEventListener("resize", this.resize);
  }

  detach(): void {
    window.cancelAnimationFrame(this.rafHandle);
    window.removeEventListener("resize", this.resize);

    this.keys.stop();
    if (this.target) {
      this.target.removeChild(this.canvas);
      this.target = null;
    }
  }

  resize = (): void => {
    if (!this.target) {
      return;
    }

    const { offsetWidth, offsetHeight } = this.target;

    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix();

    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(offsetWidth, offsetHeight);
  };

  animate: FrameRequestCallback = t => {
    this.rafHandle = window.requestAnimationFrame(this.animate);

    const dt = (t - this.previousTimestamp) / 1000;
    this.previousTimestamp = t;

    this.smallCube.rotation.x += 0.01;
    this.smallCube.rotation.y += 0.01;
    this.smallCube.position.copy(f(t, 10000, 2));

    if (this.keys.isPressed("w")) {
      this.camera.translateOnAxis(directions.forwards, 2 * dt);
    }
    if (this.keys.isPressed("s")) {
      this.camera.translateOnAxis(directions.backwards, 2 * dt);
    }
    if (this.keys.isPressed("a")) {
      this.camera.translateOnAxis(directions.left, 2 * dt);
    }
    if (this.keys.isPressed("d")) {
      this.camera.translateOnAxis(directions.right, 2 * dt);
    }
    if (this.keys.isPressed(" ")) {
      this.camera.position.y += 2 * dt;
    }
    if (this.keys.isPressed("Shift")) {
      this.camera.position.y -= 2 * dt;
    }

    if (this.keys.isPressed("ArrowLeft")) {
      this.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), dt);
    }
    if (this.keys.isPressed("ArrowRight")) {
      this.camera.rotateOnWorldAxis(new Vector3(0, -1, 0), dt);
    }
    if (this.keys.isPressed("ArrowUp")) {
      this.camera.rotateOnAxis(new Vector3(1, 0, 0), dt);
    }
    if (this.keys.isPressed("ArrowDown")) {
      this.camera.rotateOnAxis(new Vector3(-1, 0, 0), dt);
    }

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    if (this.activeMesh) {
      this.arrows.position.copy(this.activeMesh.position);
      this.renderer.clearDepth();
      this.renderer.render(this.controlsScene, this.camera);
    }
  };

  onClick = (e: MouseEvent) => {
    if (e.button !== MouseButton.Primary) {
      return;
    }

    if (this.activeMesh) {
      this.activeMesh.remove(this.outlineMesh);
      this.activeMesh = null;
    }

    const size = this.renderer.getSize(new Vector2());
    const x = ((e.pageX - this.canvas.offsetLeft) / size.x) * 2 - 1;
    const y = -((e.pageY - this.canvas.offsetTop) / size.y) * 2 + 1;
    // console.log(size, x, y);

    const raycaster = new Raycaster();
    raycaster.setFromCamera({ x, y }, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children);

    for (let i = 0; i < intersections.length && !this.activeMesh; i++) {
      const o = intersections[i].object as Mesh;
      if (o.isMesh) {
        this.activeMesh = o;
        this.outlineMesh.geometry = this.activeMesh.geometry;
        this.activeMesh.add(this.outlineMesh);
      }
    }
  };

  onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    // console.log('onWheel', e.deltaX, e.deltaY, e.deltaZ, e.deltaMode);
    let delta = e.deltaY;
    if (e.deltaMode === 0) {
      // More granular zoom for pixel mode
      delta /= 15;
    }
    this.camera.translateZ(delta);
  };

  onMouseDown = (e: MouseEvent): void => {
    if (e.button === MouseButton.Secondary) {
      this.isDraggingCamera = true;
      this.canvas.requestPointerLock();
    }
  };

  onMouseUp = (e: MouseEvent): void => {
    if (e.button === MouseButton.Secondary && this.isDraggingCamera) {
      document.exitPointerLock();
      this.isDraggingCamera = false;
    }
  };

  onMouseMove = (e: MouseEvent): void => {
    if (this.isDraggingCamera) {
      if (e.movementX) {
        this.camera.rotateOnWorldAxis(new Vector3(0, -1, 0), e.movementX / 100);
      }
      if (e.movementY) {
        this.camera.rotateOnAxis(new Vector3(-1, 0, 0), e.movementY / 100);
      }
    }
  };
}
