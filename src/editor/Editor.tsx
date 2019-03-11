import React from "react";
import styled from "styled-components";
import { Mesh } from "three";
import SceneCanvas from "../3d/SceneCanvas";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
`;

const Sidebar = styled.aside`
  width: 250px;
  height: 100%;
  background: #34495e;
  color: #fff;
  padding: 10px 15px;
`;

const Main = styled.main`
  flex: 1;
  height: 100%;
`;

interface State {
  selectedObject?: Mesh;
}

export default class Editor extends React.Component<{}, State> {
  state: State = {};
  mainRef = React.createRef<HTMLElement>();
  sceneCanvas = new SceneCanvas({
    onSelect: o => {
      this.setState({ selectedObject: o });
    }
  });

  componentDidMount(): void {
    this.sceneCanvas.attach(this.mainRef.current!);
  }

  componentWillUnmount(): void {
    this.sceneCanvas.detach();
  }

  render(): React.ReactNode {
    const o = this.state.selectedObject;
    return (
      <Container>
        <Sidebar>
          <p>Sidebar</p>
          {o && <p>Selected object: {o.uuid}</p>}
        </Sidebar>
        <Main ref={this.mainRef} />
      </Container>
    );
  }
}
