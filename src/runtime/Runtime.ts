/**
 * @author Daniel Salomon
 */
import { Raycaster, Vector3, WebGLRenderer } from "three";
import GamepadListener from "../input/GamepadListener";
import KeyboardListener from "../input/KeyboardListener";
import Project from "../project/Project";

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

  renderer = new WebGLRenderer();
  canvas: HTMLCanvasElement;

  raycaster = new Raycaster();

  keys = new KeyboardListener(this.renderer.domElement);
  gamepads = new GamepadListener();

  constructor(project: Project) {
    this.project = project;
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = -1; // Make element focusable

    this.project.selectRoom(this.project.rooms[0]);
    this.project.camera.position.set(0, 1, 2);
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

  changeProject(project: Project): void {
    this.project = project;
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

    this.renderer.render(this.project.activeRoom, this.project.camera);
  };

  update(dt: number): void {
    const { camera } = this.project;
    let moveX = 0;
    let moveZ = 0;

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

    if (this.keys.isPressed("ArrowLeft")) {
      camera.rotateOnWorldAxis(axes.y, dt);
    }
    if (this.keys.isPressed("ArrowRight")) {
      camera.rotateOnWorldAxis(axes.y, -dt);
    }

    const gamepadAxes = {
      x: this.gamepads.getAxis(0),
      y: this.gamepads.getAxis(1),
      rX: this.gamepads.getAxis(2)
    };
    // console.log(axes);
    if (gamepadAxes.x) {
      camera.translateOnAxis(axes.x, 2 * dt * gamepadAxes.x);
    }
    if (gamepadAxes.y) {
      camera.translateOnAxis(axes.z, 2 * dt * gamepadAxes.y);
    }
    if (gamepadAxes.rX) {
      camera.rotateOnWorldAxis(axes.y, -dt * gamepadAxes.rX);
    }
  }
}
