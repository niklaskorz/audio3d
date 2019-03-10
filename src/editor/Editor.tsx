import React from "react";
import styled from "styled-components";
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
  background: #666;
`;

const Main = styled.main`
  flex: 1;
  height: 100%;
`;

export default class Editor extends React.Component {
  mainRef = React.createRef<HTMLElement>();
  sceneCanvas = new SceneCanvas();

  componentDidMount(): void {
    this.sceneCanvas.attach(this.mainRef.current!);
  }

  componentWillUnmount(): void {
    this.sceneCanvas.detach();
  }

  render(): React.ReactNode {
    return (
      <Container>
        <Sidebar>Sidebar</Sidebar>
        <Main ref={this.mainRef} />
      </Container>
    );
  }
}
