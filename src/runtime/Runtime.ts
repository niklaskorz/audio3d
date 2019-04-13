/**
 * @author Daniel Salomon
 */
import { Raycaster, Vector3, WebGLRenderer, Object3D, Mesh } from "three";
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
  playerHeight = 1.8; //1,80m player height, eyes are ~10cm lower

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

  isBetween(check: number, from: number, to: number): boolean {
    let min = Math.min.apply(Math, [from, to]),
      max = Math.max.apply(Math, [from, to]);
    return check >= min && check <= max;
  }

  update(dt: number): void {
    const { camera } = this.project;
    this.dummyCamera.position.copy(camera.position);
    this.dummyCamera.rotation.copy(camera.rotation);

    let moveX = 0;
    let moveZ = 0;
    let rotateY = 0;

    if (this.keys.isPressed("w")) {
      let newZ = -2 * dt;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (this.keys.isPressed("s")) {
      let newZ = 2 * dt;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (this.keys.isPressed("a")) {
      let newX = -2 * dt;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }
    if (this.keys.isPressed("d")) {
      let newX = 2 * dt;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }

    if (this.keys.isPressed("ArrowLeft")) {
      let newY = dt;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }
    if (this.keys.isPressed("ArrowRight")) {
      let newY = -dt;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }

    const gamepadAxes = {
      x: this.gamepads.getAxis(0),
      y: this.gamepads.getAxis(1),
      rX: this.gamepads.getAxis(2)
    };
    // console.log(axes);
    if (gamepadAxes.x) {
      let newX = 2 * dt * gamepadAxes.x;
      moveX = Math.abs(moveX) < Math.abs(newX) ? newX : moveX;
    }
    if (gamepadAxes.y) {
      let newZ = 2 * dt * gamepadAxes.y;
      moveZ = Math.abs(moveZ) < Math.abs(newZ) ? newZ : moveZ;
    }
    if (gamepadAxes.rX) {
      let newY = -dt * gamepadAxes.rX;
      rotateY = Math.abs(rotateY) < Math.abs(newY) ? newY : rotateY;
    }

    // Executing the rotation/movement after all keys are evaluated prevents the issue of double movement speed when both, keyboard and gamepad, is used at the same time.
    camera.rotateOnWorldAxis(axes.y, rotateY); // Rotate left & right
    //Apply movement to dummy object first to check if a collision is happening. If not, apply to actual camera.
    this.dummyCamera.translateOnAxis(axes.z, moveZ); // Move forwards & backwards
    this.dummyCamera.translateOnAxis(axes.x, moveX); // Move left & right

    //Values to check for collision
    let newX = this.dummyCamera.position.x;
    let newZ = this.dummyCamera.position.z;

    //Check for collision
    let collided = false;
    for (let i of this.project.activeRoom.children) {
      if (!(i instanceof Mesh)) {
        continue;
      }
      const thresholdMovement = 0.25; //Minimum allowed distance to an object
      const thresholdHeight = 0.05; //Minimum allowed distance to an object below or above the player (player height is 1,80[m])
      let boundX1 = i.position.x + i.scale.x / 2 + thresholdMovement;
      let boundX2 = i.position.x - i.scale.x / 2 - thresholdMovement;
      let boundY1 = i.position.y + i.scale.y / 2 + thresholdHeight;
      let boundY2 = i.position.y - i.scale.y / 2 - thresholdHeight;
      let boundZ1 = i.position.z + i.scale.z / 2 + thresholdMovement;
      let boundZ2 = i.position.z - i.scale.z / 2 - thresholdMovement;

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

    if (!collided) {
      camera.position.copy(this.dummyCamera.position);
    }
  }
}
