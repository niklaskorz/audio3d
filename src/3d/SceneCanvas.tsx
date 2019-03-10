import * as React from "react";
import styled from "styled-components";
import {
  BackSide,
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
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

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default class SceneCanvas extends React.Component {
  containerRef = React.createRef<HTMLDivElement>();
  rafHandle = 0;
  previousTimestamp = 0;

  target: Mesh | null = null;

  scene = new Scene();
  camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new WebGLRenderer();
  grid = new GridHelper(10, 10);
  smallCube = new Mesh();
  outlineMesh = new Mesh();

  keys = new KeyboardListener();
  isDraggingCamera = false;

  constructor(props: any) {
    super(props);

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

    this.scene.add(cube);
    this.scene.add(this.smallCube);
    this.scene.add(this.grid);

    this.camera.position.x = -2;
    this.camera.position.y = 2;
    this.camera.position.z = 3;
    this.camera.lookAt(this.scene.position);

    const outlineMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: BackSide
    });
    this.outlineMesh.material = outlineMaterial;
    this.outlineMesh.scale.multiplyScalar(1.05);

    console.log(this.scene.toJSON());
  }

  componentDidMount(): void {
    this.keys.listen();
    this.containerRef.current!.appendChild(this.renderer.domElement);

    this.containerRef.current!.focus();
    this.resize();
    this.animate(0);
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount(): void {
    this.keys.stop();
    window.cancelAnimationFrame(this.rafHandle);
    window.removeEventListener("resize", this.resize);
  }

  resize = (): void => {
    if (!this.containerRef.current) {
      return;
    }

    const { offsetWidth, offsetHeight } = this.containerRef.current;

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

    this.renderer.render(this.scene, this.camera);
  };

  onClick: React.MouseEventHandler<HTMLElement> = e => {
    if (e.button !== MouseButton.Primary) {
      return;
    }

    const size = this.renderer.getSize(new Vector2());
    const x = ((e.pageX - e.currentTarget.offsetLeft) / size.x) * 2 - 1;
    const y = -((e.pageY - e.currentTarget.offsetTop) / size.y) * 2 + 1;
    console.log(size, x, y);

    const raycaster = new Raycaster();
    raycaster.setFromCamera({ x, y }, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children, true);
    if (this.target) {
      this.target.remove(this.outlineMesh);
      this.target = null;
    }
    for (let i = 0; i < intersections.length && !this.target; i++) {
      if (intersections[i].object !== this.grid) {
        this.target = intersections[i].object as Mesh;
        this.outlineMesh.geometry = this.target.geometry;
        this.target.add(this.outlineMesh);
      }
    }
  };

  onWheel: React.WheelEventHandler = e => {
    e.preventDefault();
    // console.log('onWheel', e.deltaX, e.deltaY, e.deltaZ, e.deltaMode);
    let delta = e.deltaY;
    if (e.deltaMode === 0) {
      // More granular zoom for pixel mode
      delta /= 15;
    }
    this.camera.translateZ(delta);
  };

  onMouseDown: React.MouseEventHandler = e => {
    if (e.button === MouseButton.Secondary) {
      this.isDraggingCamera = true;
      this.containerRef.current!.requestPointerLock();
    }
  };

  onMouseUp: React.MouseEventHandler = e => {
    if (e.button === MouseButton.Secondary && this.isDraggingCamera) {
      document.exitPointerLock();
      this.isDraggingCamera = false;
    }
  };

  onMouseMove: React.MouseEventHandler = e => {
    if (this.isDraggingCamera) {
      if (e.movementX) {
        this.camera.rotateOnWorldAxis(new Vector3(0, -1, 0), e.movementX / 100);
      }
      if (e.movementY) {
        this.camera.rotateOnAxis(new Vector3(-1, 0, 0), e.movementY / 100);
      }
    }
  };

  render(): React.ReactNode {
    return (
      <Container
        tabIndex={-1}
        ref={this.containerRef}
        onClick={this.onClick}
        onWheel={this.onWheel}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onContextMenu={e => e.preventDefault()}
      />
    );
  }
}
