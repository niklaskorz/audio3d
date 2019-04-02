/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions } from "resonance-audio";
import { Euler, Vector3 } from "three";
import Project from "../project/Project";
import Room from "../project/Room";
import ObjectEditor from "./ObjectEditor";
import ProjectCanvas from "./ProjectCanvas";
import RoomEditor from "./RoomEditor";
import { Container, Main, Sidebar } from "./styled";
import { EditorObject, EditorRoom } from "./types";

interface State {
  rooms: EditorRoom[];
  selectedRoomId: number;
  selectedObject: EditorObject | null;
}

export default class Editor extends React.Component<{}, State> {
  project = new Project({
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
  projectCanvas = new ProjectCanvas(this.project);

  state: State = {
    rooms: this.project.rooms.map(r => ({
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
      this.projectCanvas.attach(this.mainRef.current);
    }
  }

  componentWillUnmount(): void {
    this.projectCanvas.detach();
  }

  selectRoom(id: number): void {
    this.projectCanvas.selectObject(null);
    this.project.activeRoom = this.project.rooms[id];
    this.setState({ selectedRoomId: id, selectedObject: null });
  }

  updateRoomName = (name: string) => {
    this.project.activeRoom.name = name;
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
    this.project.activeRoom.dimensions = dimensions;
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
    if (this.project.activeObject) {
      this.project.activeObject.name = name;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        name
      }
    }));
  };

  updateScale = (x: number, y: number, z: number) => {
    if (this.project.activeObject) {
      this.project.activeObject.scale.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        scale: new Vector3(x, y, z)
      }
    }));
  };

  updatePosition = (x: number, y: number, z: number) => {
    if (this.project.activeObject) {
      this.project.activeObject.position.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        position: new Vector3(x, y, z)
      }
    }));
  };

  updateRotation = (x: number, y: number, z: number) => {
    if (this.project.activeObject) {
      this.project.activeObject.rotation.set(x, y, z);
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        rotation: new Euler(x, y, z)
      }
    }));
  };

  updateAudio = (data: ArrayBuffer) => {
    this.projectCanvas.addAudioToActiveMesh(data);
  };

  onAddRoomClick = () => {
    const room = new Room(this.project.audioLibrary, "New room", {
      width: 10,
      depth: 10,
      height: 3
    });
    this.project.rooms.push(room);
    this.projectCanvas.selectObject(null);
    this.project.activeRoom = room;
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
    this.project.activeRoom.addCube();
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
