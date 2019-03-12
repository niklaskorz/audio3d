import React, { KeyboardEventHandler } from "react";
import styled from "styled-components";
import { Euler, Mesh, Vector3 } from "three";
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

interface WorldObject {
  id: number;
  name: string;
  position: Vector3;
  rotation: Euler;
}

interface State {
  selectedObject: WorldObject | null;
}

export default class Editor extends React.Component<{}, State> {
  state: State = { selectedObject: null };
  mainRef = React.createRef<HTMLElement>();
  sceneCanvas = new SceneCanvas({
    onSelect: o => {
      if (o) {
        this.setState({
          selectedObject: {
            id: o.id,
            name: o.name,
            position: o.position,
            rotation: o.rotation
          }
        });
      } else {
        this.setState({ selectedObject: null });
      }
    },
    onTranslate: p => {
      this.setState(({ selectedObject }) => ({
        selectedObject: {
          ...selectedObject!,
          position: p
        }
      }));
    }
  });

  componentDidMount(): void {
    this.sceneCanvas.attach(this.mainRef.current!);
  }

  componentWillUnmount(): void {
    this.sceneCanvas.detach();
  }

  updateName(name: string): void {
    this.sceneCanvas.activeMesh!.name = name;
    this.setState(({ selectedObject }) => ({
      selectedObject: {
        ...selectedObject!,
        name
      }
    }));
  }

  updatePosition(x: number, y: number, z: number): void {
    this.sceneCanvas.activeMesh!.position.set(x, y, z);
    this.setState(({ selectedObject }) => ({
      selectedObject: {
        ...selectedObject!,
        position: new Vector3(x, y, z)
      }
    }));
  }

  render(): React.ReactNode {
    const o = this.state.selectedObject;
    return (
      <Container>
        <Sidebar>
          <p>Sidebar</p>
          {o && (
            <div>
              Selected object with id {o.id}
              <div>
                <input
                  type="text"
                  value={o.name}
                  onChange={e => this.updateName(e.currentTarget.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={o.position.x}
                  onChange={e =>
                    this.updatePosition(
                      e.currentTarget.valueAsNumber,
                      o.position.y,
                      o.position.z
                    )
                  }
                />
                <input
                  type="number"
                  value={o.position.y}
                  onChange={e =>
                    this.updatePosition(
                      o.position.x,
                      e.currentTarget.valueAsNumber,
                      o.position.z
                    )
                  }
                />
                <input
                  type="number"
                  value={o.position.z}
                  onChange={e =>
                    this.updatePosition(
                      o.position.x,
                      o.position.y,
                      e.currentTarget.valueAsNumber
                    )
                  }
                />
              </div>
              {/*<div>
                <input type="number" value={o.rotation.x} />
                <input type="number" value={o.rotation.y} />
                <input type="number" value={o.rotation.z} />
              </div>*/}
            </div>
          )}
        </Sidebar>
        <Main ref={this.mainRef} />
      </Container>
    );
  }
}
