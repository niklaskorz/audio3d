/**
 * @author Niklas Korz
 */
import { Color, Mesh, Raycaster, Vector2, Vector3, WebGLRenderer } from "three";
import GamepadListener from "../input/GamepadListener";
import KeyboardListener from "../input/KeyboardListener";
import GameObject from "../project/GameObject";
import Project from "../project/Project";
import SpawnMarker from "../project/SpawnMarker";
import VisualControls, { ControlMode } from "./VisualControls";

enum MouseButton {
  Primary = 0,
  Middle = 1,
  Secondary = 2
}

const axes = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1)
};

export default class EditorCanvas {
  target!: HTMLElement;
  project: Project;

  rafHandle = 0;
  previousTimestamp = 0;

  controls: VisualControls;

  renderer = new WebGLRenderer();
  canvas: HTMLCanvasElement;
  outlineMesh = new Mesh();

  raycaster = new Raycaster();

  keys = new KeyboardListener(this.renderer.domElement);
  gamepads = new GamepadListener();
  isDraggingCamera = false;

  constructor(project: Project) {
    this.project = project;

    this.renderer.autoClear = false;
    this.renderer.setClearColor(new Color(0x192a56));
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = -1; // Make element focusable
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

    this.controls = new VisualControls(project);

    // const ph = new PlaneHelper(this.controls.plane, 10, 0x999999);
    // this.scene.add(ph);
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
      delete this.target;
    }

    this.keys.stop();
    this.gamepads.stop();
  }

  focus(): void {
    this.canvas.focus();
  }

  changeProject(project: Project): void {
    this.project = project;
    this.controls.project = project;
    // Ensure the selected project's camera has the correct aspect ratio
    this.resize();
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

    this.renderer.clear();
    this.renderer.render(this.project.activeRoom, this.project.camera);

    if (this.project.activeObject || this.project.activeSpawn) {
      if (this.project.activeObject) {
        this.controls.setMode(ControlMode.Normal);
        this.controls.position.copy(this.project.activeObject.position);
      } else if (this.project.activeSpawn) {
        this.controls.setMode(ControlMode.RestrictedXZ);
        this.controls.position.copy(this.project.activeSpawn.position);
      }

      // Draw controls in front of all other objects
      // https://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs/12666937#12666937
      this.renderer.clearDepth();
      this.renderer.render(this.controls, this.project.camera);
    }
  };

  update(dt: number): void {
    const { camera } = this.project;

    if (this.keys.isPressed("w")) {
      camera.translateOnAxis(axes.z, -2 * dt);
    }
    if (this.keys.isPressed("s")) {
      camera.translateOnAxis(axes.z, 2 * dt);
    }
    if (this.keys.isPressed("a")) {
      camera.translateOnAxis(axes.x, -2 * dt);
    }
    if (this.keys.isPressed("d")) {
      camera.translateOnAxis(axes.x, 2 * dt);
    }
    if (this.keys.isPressed(" ")) {
      camera.position.y += 2 * dt;
    }
    if (this.keys.isPressed("Shift")) {
      camera.position.y -= 2 * dt;
    }

    if (this.keys.isPressed("ArrowLeft")) {
      camera.rotateOnWorldAxis(axes.y, dt);
    }
    if (this.keys.isPressed("ArrowRight")) {
      camera.rotateOnWorldAxis(axes.y, -dt);
    }
    if (this.keys.isPressed("ArrowUp")) {
      camera.rotateOnAxis(axes.x, dt);
    }
    if (this.keys.isPressed("ArrowDown")) {
      camera.rotateOnAxis(axes.x, -dt);
    }

    const gamepadAxes = {
      x: this.gamepads.getAxis(0),
      y: this.gamepads.getAxis(1),
      rX: this.gamepads.getAxis(2),
      rY: this.gamepads.getAxis(3),
      b: this.gamepads.getAxis(4)
    };
    // console.log(axes);
    if (gamepadAxes.x) {
      camera.translateOnAxis(axes.x, 2 * dt * gamepadAxes.x);
    }
    if (gamepadAxes.y) {
      camera.translateOnAxis(axes.z, 2 * dt * gamepadAxes.y);
    }
    if (gamepadAxes.b) {
      camera.translateOnAxis(axes.y, 2 * dt * gamepadAxes.b);
    }
    if (gamepadAxes.rX) {
      camera.rotateOnWorldAxis(axes.y, -dt * gamepadAxes.rX);
    }
    if (gamepadAxes.rY) {
      camera.rotateOnAxis(axes.x, -dt * gamepadAxes.rY);
    }
  }

  checkSceneClick(raycaster: Raycaster): boolean {
    const intersections = raycaster.intersectObjects(
      this.project.activeRoom.children
    );
    for (const intersection of intersections) {
      const o = intersection.object;
      if (o instanceof SpawnMarker) {
        this.project.selectSpawn(o);
        return true;
      }
      if (o instanceof GameObject) {
        this.project.selectObject(o);
        return true;
      }
    }

    this.project.unselect();
    return false;
  }

  updateRaycaster(e: MouseEvent): void {
    const size = this.renderer.getSize(new Vector2());
    // Normalize screen coordinates
    const x = ((e.pageX - this.target.offsetLeft) / size.x) * 2 - 1;
    const y = -((e.pageY - this.target.offsetTop) / size.y) * 2 + 1;
    // Update raycaster
    this.raycaster.setFromCamera({ x, y }, this.project.camera);
  }

  onMouseDown = (e: MouseEvent): void => {
    if (e.button === MouseButton.Secondary) {
      this.isDraggingCamera = true;
      this.canvas.requestPointerLock();
    }

    if (e.button !== MouseButton.Primary) {
      return;
    }

    this.updateRaycaster(e);
    if (this.controls.onClick(this.raycaster)) {
      this.canvas.style.cursor = "grabbing";
    } else {
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
      if (this.controls.getControlFromRaycaster(this.raycaster)) {
        this.canvas.style.cursor = "grab";
      } else {
        this.canvas.style.cursor = null;
      }
    }
  };

  onMouseMove = (e: MouseEvent): void => {
    if (this.isDraggingCamera) {
      if (e.movementX) {
        this.project.camera.rotateOnWorldAxis(axes.y, -e.movementX / 100);
      }
      if (e.movementY) {
        this.project.camera.rotateOnAxis(axes.x, -e.movementY / 100);
      }
    } else {
      this.updateRaycaster(e);
      if (this.controls.objectDragDirection !== null) {
        this.controls.onMove(this.raycaster);
      } else if (this.controls.getControlFromRaycaster(this.raycaster)) {
        this.canvas.style.cursor = "grab";
      } else {
        this.canvas.style.cursor = null;
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
    this.project.camera.translateZ(delta / 10);
  };
}
