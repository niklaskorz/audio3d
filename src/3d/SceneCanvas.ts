import {
  ArrowHelper,
  BackSide,
  BoxGeometry,
  Color,
  DoubleSide,
  GridHelper,
  Group,
  Line3,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import ControlsScene from "./ControlsScene";
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

interface Options {
  onSelect(object: Mesh | null): void;
  onTranslate(position: Vector3): void;
}

export default class SceneCanvas {
  target: HTMLElement | null = null;

  rafHandle = 0;
  previousTimestamp = 0;

  scene = new Scene();
  controls = new ControlsScene();
  camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new WebGLRenderer();
  canvas: HTMLCanvasElement;
  grid = new GridHelper(10, 10);
  smallCube = new Mesh();
  outlineMesh = new Mesh();

  raycaster = new Raycaster();

  keys = new KeyboardListener(this.renderer.domElement);
  isDraggingCamera = false;

  constructor(private options: Options) {
    this.renderer.autoClear = false;
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = -1; // Make element focusable
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("wheel", this.onWheel);
    this.canvas.addEventListener(
      "contextmenu",
      e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      true
    );

    // Setup scene

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    const cube = new Mesh(geometry, material);
    cube.position.y += 0.5;
    cube.name = "New cube";

    this.smallCube.geometry = new BoxGeometry(0.25, 0.25, 0.25);
    this.smallCube.material = material;
    this.smallCube.translateX(2);
    this.smallCube.name = "Small cube";

    this.scene.add(cube);
    this.scene.add(this.smallCube);
    this.scene.add(this.grid);

    this.camera.position.z = 3;
    this.camera.position.y = 3;
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
    window.requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
    this.canvas.focus();
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
    // this.smallCube.position.copy(f(t, 10000, 2));

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

    if (this.controls.activeMesh) {
      // Draw controls in front of all other objects
      // https://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs/12666937#12666937
      // this.controls.position.copy(this.controls.activeMesh.position);
      this.controls.position.copy(this.controls.activeMesh.position);
      this.renderer.clearDepth();
      this.renderer.render(this.controls, this.camera);
    }
  };

  checkSceneClick(raycaster: Raycaster): boolean {
    if (this.controls.activeMesh) {
      this.controls.activeMesh.remove(this.outlineMesh);
      this.controls.activeMesh = null;
    }

    const intersections = raycaster.intersectObjects(this.scene.children);
    for (const intersection of intersections) {
      const o = intersection.object as Mesh;
      if (o.isMesh) {
        this.controls.activeMesh = o;
        this.outlineMesh.geometry = this.controls.activeMesh.geometry;
        this.controls.activeMesh.add(this.outlineMesh);

        this.options.onSelect(o);
        return true;
      }
    }

    this.options.onSelect(null);
    return false;
  }

  updateRaycaster(e: MouseEvent): void {
    const size = this.renderer.getSize(new Vector2());
    const x = ((e.pageX - this.canvas.offsetLeft) / size.x) * 2 - 1;
    const y = -((e.pageY - this.canvas.offsetTop) / size.y) * 2 + 1;
    this.raycaster.setFromCamera({ x, y }, this.camera);
  }

  onClick = (e: MouseEvent) => {
    /* Nothing here yet */
  };

  onMouseDown = (e: MouseEvent): void => {
    if (e.button === MouseButton.Secondary) {
      this.isDraggingCamera = true;
      this.canvas.requestPointerLock();
    }

    if (e.button !== MouseButton.Primary) {
      return;
    }

    this.updateRaycaster(e);
    if (!this.controls.onClick(this.raycaster)) {
      this.checkSceneClick(this.raycaster);
    }
  };

  onMouseUp = (e: MouseEvent): void => {
    if (e.button === MouseButton.Secondary && this.isDraggingCamera) {
      this.isDraggingCamera = false;
      document.exitPointerLock();
    }
    if (
      e.button === MouseButton.Primary &&
      this.controls.objectDragDirection !== null
    ) {
      this.controls.objectDragDirection = null;
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
    } else {
      this.updateRaycaster(e);
      this.controls.onMove(this.raycaster);
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
    this.camera.translateZ(delta / 10);
  };
}
