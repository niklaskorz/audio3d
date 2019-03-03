import * as React from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  Vector3,
  Vector2
} from "three";
import styled from "styled-components";
import { BoxGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Raycaster } from "three";
import { GridHelper } from "three";
import { Euler } from "three";

// Circular position based on timestamp
const f = (t: number) =>
  new Vector3(
    3 * Math.sin((t / 4000) * 2 * Math.PI),
    1,
    3 * Math.cos((t / 4000) * 2 * Math.PI)
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

  cube: Mesh;

  dRotation = new Euler(0, 0, 0);
  dPosition = new Vector3(0, 0, 0);

  constructor(props: any) {
    super(props);

    const grid = new GridHelper(100, 10);
    // this.scene.add(grid);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    this.cube = new Mesh(geometry, material);

    const geometry2 = new BoxGeometry(0.25, 0.25, 0.25);
    const cube2 = new Mesh(geometry2, material);
    cube2.translateX(1);

    this.cube.add(cube2);

    this.scene.add(this.cube);
    this.camera.position.z = 5;
  }

  componentDidMount() {
    this.containerRef.current!.appendChild(this.renderer.domElement);
    this.onResize();
    this.animate(0);
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle);
    window.removeEventListener("resize", this.onResize);
  }

  onResize = () => {
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

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    // this.cube.position.copy(f(t));

    this.camera.rotateOnAxis(new Vector3(1, 0, 0), this.dRotation.x * dt);
    this.camera.rotateOnAxis(new Vector3(0, 1, 0), this.dRotation.y * dt);
    this.camera.rotateOnAxis(new Vector3(0, 0, 1), this.dRotation.z * dt);

    this.camera.translateOnAxis(new Vector3(1, 0, 0), this.dPosition.x * dt);
    this.camera.translateOnAxis(new Vector3(0, 1, 0), this.dPosition.y * dt);
    this.camera.translateOnAxis(new Vector3(0, 0, 1), this.dPosition.z * dt);

    this.renderer.render(this.scene, this.camera);
  };

  onClick: React.MouseEventHandler<HTMLElement> = e => {
    const size = this.renderer.getSize(new Vector2());
    const x = ((e.pageX - e.currentTarget.offsetLeft) / size.x) * 2 - 1;
    const y = -((e.pageY - e.currentTarget.offsetTop) / size.y) * 2 + 1;
    console.log(size, x, y);

    const raycaster = new Raycaster();
    raycaster.setFromCamera({ x, y }, this.camera);
    const intersections = raycaster.intersectObjects(this.scene.children, true);
    if (this.target) {
      (this.target.material as MeshBasicMaterial).color.set(0xffffff);
      this.target = null;
    }
    if (intersections.length > 0) {
      this.target = intersections[0].object as Mesh;
      console.log(this.target);
      (this.target.material as MeshBasicMaterial).color.set(0xff0000);
    }
  };

  onKeyDown: React.KeyboardEventHandler = e => {
    // Begin
    console.log(e.key);
    switch (e.key) {
      case ",":
        // Rotate left
        this.dRotation.z = 1;
        break;
      case ".":
        // Rotate right
        this.dRotation.z = -1;
        break;
      case "ArrowLeft":
        // Rotate left
        this.dRotation.y = 1;
        break;
      case "ArrowRight":
        // Rotate right
        this.dRotation.y = -1;
        break;
      case "ArrowUp":
        // Rotate up
        this.dRotation.x = 1;
        break;
      case "ArrowDown":
        // Rotate down
        this.dRotation.x = -1;
        break;
      case "q":
        // Up
        this.dPosition.y = 2;
        break;
      case "e":
        // Down
        this.dPosition.y = -2;
        break;
      case "w":
        // Forwards
        this.dPosition.z = -2;
        break;
      case "s":
        // Backwards
        this.dPosition.z = 2;
        break;
      case "a":
        // Left
        this.dPosition.x = -2;
        break;
      case "d":
        // Right
        this.dPosition.x = 2;
        break;
    }
  };

  onKeyUp: React.KeyboardEventHandler = e => {
    // End
    switch (e.key) {
      case ",":
        // Rotate left
        this.dRotation.z = 0;
        break;
      case ".":
        // Rotate right
        this.dRotation.z = 0;
        break;
      case "ArrowLeft":
        // Rotate left
        this.dRotation.y = 0;
        break;
      case "ArrowRight":
        // Rotate right
        this.dRotation.y = 0;
        break;
      case "ArrowUp":
        // Rotate forwards
        this.dRotation.x = 0;
        break;
      case "ArrowDown":
        // Rotate backwards
        this.dRotation.x = 0;
        break;
      case "q":
        // Up
        this.dPosition.y = 0;
        break;
      case "e":
        // Down
        this.dPosition.y = 0;
        break;
      case "w":
        // Forwards
        this.dPosition.z = 0;
        break;
      case "s":
        // Backwards
        this.dPosition.z = 0;
        break;
      case "a":
        // Left
        this.dPosition.x = 0;
        break;
      case "d":
        // Right
        this.dPosition.x = 0;
        break;
    }
  };

  render(): React.ReactNode {
    return (
      <Container
        tabIndex={-1}
        ref={this.containerRef}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      />
    );
  }
}
