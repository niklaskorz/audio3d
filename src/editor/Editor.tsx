/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions } from "resonance-audio";
import { Euler, Vector3 } from "three";
import Room from "../3d/Room";
import SceneCanvas from "../3d/SceneCanvas";
import ObjectEditor from "./ObjectEditor";
import RoomEditor from "./RoomEditor";
import { Container, Main, Sidebar } from "./styled";
import { EditorObject, EditorRoom } from "./types";

interface State {
  rooms: EditorRoom[];
  selectedRoomId: number;
  selectedObject: EditorObject | null;
}

export default class Editor extends React.Component<{}, State> {
  rooms: Room[] = [new Room("First room", { width: 15, depth: 10, height: 3 })];
  sceneCanvas = new SceneCanvas(this.rooms[0], {
    onSelect: o => {
      if (o) {
        this.setState({
          selectedObject: {
            id: o.id,
            name: o.name,
            position: o.position,
            scale: o.scale,
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
    },
    onScale: s => {
      this.setState(({ selectedObject }) => ({
        selectedObject: selectedObject && {
          ...selectedObject,
          size: {
            width: s.x,
            height: s.y,
            depth: s.z
          }
        }
      }));
    }
  });

  state: State = {
    rooms: this.rooms.map(r => ({
      id: r.id,
      name: r.name,
      dimensions: r.dimensions
    })),
    selectedRoomId: 0,
    selectedObject: null
  };
  mainRef = React.createRef<HTMLElement>();

  componentDidMount(): void {
    if (this.mainRef.current) {
      this.sceneCanvas.attach(this.mainRef.current);
    }
  }

  componentWillUnmount(): void {
    this.sceneCanvas.detach();
  }

  selectRoom(id: number): void {
    this.sceneCanvas.selectMesh(null);
    this.sceneCanvas.room = this.rooms[id];
    this.setState({ selectedRoomId: id, selectedObject: null });
  }

  updateRoomName = (name: string) => {
    this.sceneCanvas.room.name = name;
    this.setState(({ rooms, selectedRoomId }) => ({
      rooms: [
        ...rooms.slice(0, selectedRoomId),
        {
          ...rooms[selectedRoomId],
          name
        },
        ...rooms.slice(selectedRoomId + 1)
      ]
    }));
  };

  updateRoomDimensions = (dimensions: RoomDimensions) => {
    this.sceneCanvas.room.dimensions = dimensions;
    this.setState(({ rooms, selectedRoomId }) => ({
      rooms: [
        ...rooms.slice(0, selectedRoomId),
        {
          ...rooms[selectedRoomId],
          dimensions
        },
        ...rooms.slice(selectedRoomId + 1)
      ]
    }));
  };

  updateName = (name: string) => {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.name = name;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        name
      }
    }));
  };

  updateScale = (x: number, y: number, z: number) => {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.scale.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        scale: new Vector3(x, y, z)
      }
    }));
  };

  updatePosition = (x: number, y: number, z: number) => {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.position.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        position: new Vector3(x, y, z)
      }
    }));
  };

  updateRotation = (x: number, y: number, z: number) => {
    if (this.sceneCanvas.controls.activeMesh) {
      this.sceneCanvas.controls.activeMesh.rotation.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        rotation: new Euler(x, y, z)
      }
    }));
  };

  updateAudio = (data: ArrayBuffer) => {
    this.sceneCanvas.addAudioToActiveMesh(data);
  };

  onAddRoomClick = () => {
    const room = new Room("New room", { width: 10, depth: 10, height: 3 });
    this.rooms.push(room);
    this.sceneCanvas.selectMesh(null);
    this.sceneCanvas.room = room;
    this.setState(s => ({
      rooms: [
        ...s.rooms,
        {
          id: room.id,
          name: room.name,
          dimensions: room.dimensions
        }
      ],
      selectedRoomId: s.rooms.length
    }));
  };

  onAddCubeClick = () => {
    this.sceneCanvas.room.addCube();
  };

  render(): React.ReactNode {
    const o = this.state.selectedObject;
    return (
      <Container>
        <Sidebar>
          <p>Sidebar</p>
          <div>
            <button onClick={this.onAddRoomClick}>Add room</button>
            <button onClick={this.onAddCubeClick}>Add cube</button>
          </div>
          <ol>
            {this.state.rooms.map((r, i) => (
              <li
                key={r.id}
                onClick={() => this.selectRoom(i)}
                style={{ cursor: "pointer" }}
              >
                {r.name}
              </li>
            ))}
          </ol>
          {!o && (
            <RoomEditor
              room={this.state.rooms[this.state.selectedRoomId]}
              onUpdateName={this.updateRoomName}
              onUpdateDimensions={this.updateRoomDimensions}
            />
          )}
          {o && (
            <ObjectEditor
              object={o}
              onUpdateName={this.updateName}
              onUpdatePosition={this.updatePosition}
              onUpdateRotation={this.updateRotation}
              onUpdateScale={this.updateScale}
              onUpdateAudio={this.updateAudio}
            />
          )}
        </Sidebar>
        <Main ref={this.mainRef} />
      </Container>
    );
  }
}
