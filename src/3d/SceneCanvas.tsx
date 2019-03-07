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

  :focus {
    border-left: 2px solid blue;
  }
`;

export default class SceneCanvas extends React.Component {
  containerRef = React.createRef<HTMLDivElement>();
  rafHandle = 0;
  previousTimestamp = 0;

  target: Mesh | null = null;

  scene = new Scene();
  camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new WebGLRenderer();
  grid = new GridHelper(10, 10)
  cube: Mesh;

  keysPressed = new Set<string>();

  constructor(props: any) {
    super(props);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      // wireframe: true
    });
    this.cube = new Mesh(geometry, material);

    const geometry2 = new BoxGeometry(0.25, 0.25, 0.25);
    const cube2 = new Mesh(geometry2, material);
    cube2.translateX(1);

    this.scene.add(cube2);
    this.scene.add(this.cube);
    this.scene.add(this.grid);
    this.camera.position.z = 5;
  }

  componentDidMount() {
    this.containerRef.current!.appendChild(this.renderer.domElement);
    this.containerRef.current!.focus();
    this.resize();
    this.animate(0);
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandle);
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
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

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.cube.position.copy(f(t));

    const translationAxis = new Vector3();
    if (this.isKeyPressed('a')) {
      translationAxis.x -= 1;
    }
    if (this.isKeyPressed('d')) {
      translationAxis.x += 1;
    }
    if (this.isKeyPressed('w')) {
      translationAxis.y += 1;
    }
    if (this.isKeyPressed('s')) {
      translationAxis.y -= 1;
    }
    if (translationAxis.x || translationAxis.y) {
      this.camera.translateOnAxis(translationAxis, 2 * dt);
    }

    if (this.isKeyPressed('ArrowLeft')) {
      this.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), dt);
    }
    if (this.isKeyPressed('ArrowRight')) {
      this.camera.rotateOnWorldAxis(new Vector3(0, -1, 0), dt);
    }
    if (this.isKeyPressed('ArrowUp')) {
      this.camera.rotateOnAxis(new Vector3(1, 0, 0), dt);
    }
    if (this.isKeyPressed('ArrowDown')) {
      this.camera.rotateOnAxis(new Vector3(-1, 0, 0), dt);
    }

    this.renderer.render(this.scene, this.camera);
  };

  isKeyPressed(key: string) {
    return this.keysPressed.has(key);
  }

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
    for (let i = 0; i < intersections.length && !this.target; i++) {
      if (intersections[i].object !== this.grid) {
        this.target = intersections[i].object as Mesh;
        console.log(this.target);
        (this.target.material as MeshBasicMaterial).color.set(0xff0000);
      }
    }
  };

  onWheel: React.WheelEventHandler = e => {
    e.preventDefault();
    //console.log('onWheel', e.deltaX, e.deltaY, e.deltaZ, e.deltaMode);
    let delta = e.deltaY;
    if (e.deltaMode === 0) {
      // More granular zoom for pixel mode
      delta /= 15;
    }
    this.camera.translateZ(delta);
  }

  onKeyDown: React.KeyboardEventHandler = e => {
    this.keysPressed.add(e.key);
    //console.log(e.key);
  };

  onKeyUp: React.KeyboardEventHandler = e => {
    this.keysPressed.delete(e.key);
  };

  render(): React.ReactNode {
    return (
      <Container
        tabIndex={-1}
        ref={this.containerRef}
        onClick={this.onClick}
        onWheel={this.onWheel}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      />
    );
  }
}
