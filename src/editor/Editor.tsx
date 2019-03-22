/**
 * @author Niklas Korz
 */
import React from "react";
import styled from "styled-components";
import { Euler, Vector3 } from "three";
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

const Group = styled.div`
  margin: 20px 0;
`;

const Input = styled.input`
  display: block;
  appearance: none;
  background: #2c3e50;
  border-radius: 3px;
  border: 2px solid #2c3e50;
  color: #fff;
  width: 100%;
  padding: 10px 12px;
  margin: 5px 0;

  transition: 0.2s ease border-color;
  :focus {
    outline: none;
    border-color: #3498db;
  }
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
        selectedObject: selectedObject && {
          ...selectedObject,
          position: p
        }
      }));
    }
  });

  componentDidMount(): void {
    if (this.mainRef.current) {
      this.sceneCanvas.attach(this.mainRef.current);
    }
  }

  componentWillUnmount(): void {
    this.sceneCanvas.detach();
  }

  updateName(name: string): void {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.name = name;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        name
      }
    }));
  }

  updatePosition(x: number, y: number, z: number): void {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.position.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        position: new Vector3(x, y, z)
      }
    }));
  }

  updateRotation(x: number, y: number, z: number): void {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.rotation.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        rotation: new Euler(x, y, z)
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
              <Group>
                <label>Name</label>
                <Input
                  type="text"
                  value={o.name}
                  onChange={e => this.updateName(e.currentTarget.value)}
                />
              </Group>
              <Group>
                <label>Position (x, y, z)</label>
                <Input
                  type="number"
                  step="any"
                  value={o.position.x}
                  onChange={e =>
                    this.updatePosition(
                      e.currentTarget.valueAsNumber,
                      o.position.y,
                      o.position.z
                    )
                  }
                />
                <Input
                  type="number"
                  step="any"
                  value={o.position.y}
                  onChange={e =>
                    this.updatePosition(
                      o.position.x,
                      e.currentTarget.valueAsNumber,
                      o.position.z
                    )
                  }
                />
                <Input
                  type="number"
                  step="any"
                  value={o.position.z}
                  onChange={e =>
                    this.updatePosition(
                      o.position.x,
                      o.position.y,
                      e.currentTarget.valueAsNumber
                    )
                  }
                />
              </Group>
              <Group>
                <label>Euler-Rotation (x, y, z)</label>
                <Input
                  type="number"
                  step="any"
                  value={o.rotation.x}
                  onChange={e =>
                    this.updateRotation(
                      e.currentTarget.valueAsNumber,
                      o.rotation.y,
                      o.rotation.z
                    )
                  }
                />
                <Input
                  type="number"
                  step="any"
                  value={o.rotation.y}
                  onChange={e =>
                    this.updateRotation(
                      o.rotation.x,
                      e.currentTarget.valueAsNumber,
                      o.rotation.z
                    )
                  }
                />
                <Input
                  type="number"
                  step="any"
                  value={o.rotation.z}
                  onChange={e =>
                    this.updateRotation(
                      o.rotation.x,
                      o.rotation.y,
                      e.currentTarget.valueAsNumber
                    )
                  }
                />
              </Group>
            </div>
          )}
        </Sidebar>
        <Main ref={this.mainRef} />
      </Container>
    );
  }
}
