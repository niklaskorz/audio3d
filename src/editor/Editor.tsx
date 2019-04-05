/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { saveAsZip } from "../data/export";
import { openZip } from "../data/import";
import GameObject from "../project/GameObject";
import Project from "../project/Project";
import Room from "../project/Room";
import MenuBar from "./MenuBar";
import ObjectEditor from "./ObjectEditor";
import ProjectCanvas from "./ProjectCanvas";
import RoomEditor from "./RoomEditor";
import {
  Container,
  FocusedLabel,
  Group,
  InnerContainer,
  Main,
  RoomList,
  RoomListItem,
  Sidebar
} from "./styled";
import { EditorObject, EditorRoom } from "./types";

interface State {
  rooms: EditorRoom[];
  selectedRoomId: number;
  selectedObject: EditorObject | null;
}

export default class Editor extends React.Component<{}, State> {
  project: Project = new Project();
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

  constructor(props: {}) {
    super(props);

    this.project.events = {
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    };
  }

  // React component lifecycle methods

  componentDidMount(): void {
    if (this.mainRef.current) {
      this.projectCanvas.attach(this.mainRef.current);
      this.projectCanvas.focus();
    }
  }

  componentWillUnmount(): void {
    this.projectCanvas.detach();
  }

  // Menubar functionality

  newProject = () => {
    this.project = new Project({
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    });
    this.projectCanvas.changeProject(this.project);
    this.setState({
      rooms: this.project.rooms.map(r => ({
        id: r.id,
        name: r.name,
        dimensions: r.dimensions
      })),
      selectedRoomId: 0,
      selectedObject: null
    });
  };

  importProject = async () => {
    this.project = await openZip();
    this.project.events = {
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    };
    this.projectCanvas.changeProject(this.project);
    this.setState({
      rooms: this.project.rooms.map(r => ({
        id: r.id,
        name: r.name,
        dimensions: r.dimensions
      })),
      selectedRoomId: 0,
      selectedObject: null
    });
  };

  exportProject = () => {
    saveAsZip(this.project);
  };

  addObject = () => {
    this.project.activeRoom.addCube();
  };

  deleteObject = () => {
    if (this.project.activeObject) {
      this.project.activeRoom.remove(this.project.activeObject);
      this.project.activeObject = null;
      this.setState({ selectedObject: null });
    }
  };

  addRoom = () => {
    const room = new Room(this.project.audioLibrary, "New room");
    room.addCube();
    this.project.rooms.push(room);
    this.project.selectRoom(room);
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

  deleteRoom = () => {
    // Ensure the first room cannot be deleted
    if (this.state.selectedRoomId > 0) {
      this.project.rooms.splice(this.state.selectedRoomId, 1);
      this.setState(s => ({
        rooms: [
          ...s.rooms.slice(0, s.selectedRoomId),
          ...s.rooms.slice(s.selectedRoomId + 1)
        ],
        selectedRoomId: 0
      }));
    }
  };

  // Room specific editor functionality

  selectRoom(id: number): void {
    this.project.selectRoom(this.project.rooms[id]);
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

  // Object editor functionality

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

  // Project canvas events

  onSelectObject = (o: GameObject | null) => {
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
  };

  onTranslateObject = (p: Vector3) => {
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        position: p
      }
    }));
  };

  onScaleObject = (s: Vector3) => {
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
  };

  render(): React.ReactNode {
    const o = this.state.selectedObject;
    return (
      <Container>
        <MenuBar
          onNewProject={this.newProject}
          onImportProject={this.importProject}
          onExportProject={this.exportProject}
          onAddObject={this.addObject}
          onDeleteObject={this.deleteObject}
          onAddRoom={this.addRoom}
          onDeleteRoom={this.deleteRoom}
        />
        <InnerContainer>
          <Sidebar>
            <Group>
              <label>Rooms</label>
              <RoomList>
                {this.state.rooms.map((r, i) => (
                  <RoomListItem
                    key={r.id}
                    onClick={() => this.selectRoom(i)}
                    active={i === this.state.selectedRoomId}
                  >
                    {r.name || "Anonymous Room"}
                  </RoomListItem>
                ))}
              </RoomList>
            </Group>
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
          <Main ref={this.mainRef}>
            <FocusedLabel>Focused</FocusedLabel>
          </Main>
        </InnerContainer>
      </Container>
    );
  }
}
