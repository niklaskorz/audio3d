/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { saveAsZip } from "../data/export";
import { openZip } from "../data/import";
import GameObject, { InteractionType } from "../project/GameObject";
import Project from "../project/Project";
import { ProjectData } from "../data/schema";
import AudioImplementation from "../audio/AudioImplementation";
import RuntimeContainer from "../runtime/RuntimeContainer";
import CodeBlock from "../project/CodeBlock";
import AudioLibraryModal from "./AudioLibraryModal";
import MenuBar from "./MenuBar";
import ObjectEditor from "./ObjectEditor";
import EditorCanvas from "./EditorCanvas";
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
import { EditorObject, EditorRoom, AudioEntry } from "./types";
import ProjectManagerModal from "./ProjectManagerModal";

enum ModalType {
  AudioLibrary,
  AudioSelection,
  ProjectManager,
  ProjectSelection
}

interface State {
  audioImplementation: AudioImplementation;
  rooms: EditorRoom[];
  selectedRoomId: number;
  selectedObject: EditorObject | null;
  modal: ModalType | null;
  isRunning: boolean;
}

export default class Editor extends React.Component<{}, State> {
  project: Project = new Project();
  projectCanvas = new EditorCanvas(this.project);

  state: State = {
    audioImplementation: this.project.activeAudioImplementation,
    rooms: this.project.rooms.map(r => ({
      id: r.id,
      name: r.name,
      dimensions: r.dimensions,
      materials: r.materials
    })),
    selectedRoomId: 0,
    selectedObject: null,
    modal: null,
    isRunning: false
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

  // Menubar functionality

  newProject = () => {
    this.project.close();
    this.project = new Project({
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    });
    this.projectCanvas.changeProject(this.project);
    this.setState({
      audioImplementation: this.project.activeAudioImplementation,
      rooms: this.project.rooms.map(r => ({
        id: r.id,
        name: r.name,
        dimensions: r.dimensions,
        materials: r.materials
      })),
      selectedRoomId: 0,
      selectedObject: null,
      modal: null
    });
  };

  showProjectSelection = async () => {
    this.setState({
      modal: ModalType.ProjectSelection
    });
  };

  saveProject = async () => {
    if (this.project.id == null) {
      const name = prompt("Project name:", this.project.name);
      if (!name) {
        return;
      }
      this.project.name = name;
    }
    await this.project.save();
  };

  importProject = async () => {
    this.project.close();
    this.project = await openZip();
    this.project.events = {
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    };
    this.projectCanvas.changeProject(this.project);
    this.setState({
      audioImplementation: this.project.activeAudioImplementation,
      rooms: this.project.rooms.map(r => ({
        id: r.id,
        name: r.name,
        dimensions: r.dimensions,
        materials: r.materials
      })),
      selectedRoomId: 0,
      selectedObject: null
    });
  };

  exportProject = () => {
    saveAsZip(this.project);
  };

  addObject = () => {
    this.project.activeRoom.addObject();
  };

  deleteObject = () => {
    if (this.project.activeObject) {
      this.project.activeRoom.remove(this.project.activeObject);
      this.project.activeObject.audio.stop();
      this.project.activeObject = null;
      this.setState({ selectedObject: null });
    }
  };

  addRoom = () => {
    const room = this.project.addRoom();
    this.setState(s => ({
      rooms: [
        ...s.rooms,
        {
          id: room.id,
          name: room.name,
          dimensions: room.dimensions,
          materials: room.materials
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

  showAudioLibrary = () => {
    this.setState({ modal: ModalType.AudioLibrary });
  };

  showProjectManager = () => {
    this.setState({ modal: ModalType.ProjectManager });
  };

  selectAudioImplementation = (audioImplementation: AudioImplementation) => {
    this.project.selectAudioImplementation(audioImplementation);
    this.setState({ audioImplementation });
  };

  runProject = () => {
    this.projectCanvas.detach();
    this.setState({ isRunning: true });
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

  updateRoomMaterials = (materials: RoomMaterials) => {
    this.project.activeRoom.materials = materials;
    this.setState(({ rooms, selectedRoomId }) => ({
      rooms: [
        ...rooms.slice(0, selectedRoomId),
        {
          ...rooms[selectedRoomId],
          materials
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

  updateInteractionType = (interactionType: InteractionType) => {
    if (this.project.activeObject) {
      this.project.activeObject.interactionType = interactionType;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        interactionType
      }
    }));
  };

  updateCodeBlockSource = (codeBlockSource: string) => {
    if (this.project.activeObject) {
      if (this.project.activeObject.codeBlock) {
        this.project.activeObject.codeBlock.update(codeBlockSource);
      } else {
        this.project.activeObject.codeBlock = new CodeBlock(codeBlockSource);
      }
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        codeBlockSource
      }
    }));
  };

  showAudioSelection = () => {
    this.setState({
      modal: ModalType.AudioSelection
    });
  };

  // Modal events

  dismissModal = () => {
    this.setState({ modal: null });
  };

  selectAudio = (audio: AudioEntry) => {
    if (this.project.activeObject) {
      this.project.activeObject.loadAudio(audio.id);
      this.setState(({ selectedObject }) => ({
        selectedObject: selectedObject && {
          ...selectedObject,
          audio
        },
        modal: null
      }));
    }
  };

  loadProject = (data: ProjectData) => {
    this.project.close();
    this.project = new Project().fromData(data, data.id);
    this.project.events = {
      onSelect: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    };
    this.projectCanvas.changeProject(this.project);
    this.setState({
      audioImplementation: this.project.activeAudioImplementation,
      rooms: this.project.rooms.map(r => ({
        id: r.id,
        name: r.name,
        dimensions: r.dimensions,
        materials: r.materials
      })),
      selectedRoomId: 0,
      selectedObject: null,
      modal: null
    });
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
          rotation: o.rotation,
          interactionType: o.interactionType,
          codeBlockSource: o.codeBlock && o.codeBlock.source,
          audio:
            o.audioFile && o.audioId != null
              ? {
                  ...o.audioFile,
                  id: o.audioId
                }
              : undefined
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

  // Runtime events

  exitRuntime = () => {
    this.setState({
      isRunning: false,
      audioImplementation: this.project.activeAudioImplementation
    });
  };

  // React component lifecycle methods

  attachCanvas = (target: HTMLElement | null) => {
    if (target != null) {
      this.projectCanvas.attach(target);
      this.projectCanvas.focus();
    } else {
      this.projectCanvas.detach();
    }
  };

  componentWillUnmount(): void {
    this.projectCanvas.detach();
  }

  render(): React.ReactNode {
    const { modal, isRunning, audioImplementation } = this.state;
    const o = this.state.selectedObject;

    if (isRunning) {
      return (
        <RuntimeContainer project={this.project} onExit={this.exitRuntime} />
      );
    }

    return (
      <Container>
        {(modal === ModalType.AudioLibrary ||
          modal === ModalType.AudioSelection) && (
          <AudioLibraryModal
            audioLibrary={this.project.audioLibrary}
            onDismiss={this.dismissModal}
            onSelect={
              modal === ModalType.AudioSelection ? this.selectAudio : undefined
            }
          />
        )}
        {(modal === ModalType.ProjectManager ||
          modal === ModalType.ProjectSelection) && (
          <ProjectManagerModal
            onNewProject={this.newProject}
            onDismiss={this.dismissModal}
            onSelectProject={
              modal === ModalType.ProjectSelection
                ? this.loadProject
                : undefined
            }
          />
        )}
        <MenuBar
          audioImplementation={audioImplementation}
          onAudioChange={this.selectAudioImplementation}
          onNewProject={this.newProject}
          onLoadProject={this.showProjectSelection}
          onSaveProject={this.saveProject}
          onImportProject={this.importProject}
          onExportProject={this.exportProject}
          onAddObject={this.addObject}
          onDeleteObject={this.deleteObject}
          onAddRoom={this.addRoom}
          onDeleteRoom={this.deleteRoom}
          onShowAudioLibrary={this.showAudioLibrary}
          onShowProjectManager={this.showProjectManager}
          onRunProject={this.runProject}
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
                onUpdateMaterials={this.updateRoomMaterials}
              />
            )}
            {o && (
              <ObjectEditor
                object={o}
                onUpdateName={this.updateName}
                onUpdatePosition={this.updatePosition}
                onUpdateRotation={this.updateRotation}
                onUpdateScale={this.updateScale}
                onUpdateInteractionType={this.updateInteractionType}
                onUpdateCodeBlockSource={this.updateCodeBlockSource}
                onShowAudioSelection={this.showAudioSelection}
              />
            )}
          </Sidebar>
          <Main ref={this.attachCanvas}>
            <FocusedLabel>Focused</FocusedLabel>
          </Main>
        </InnerContainer>
      </Container>
    );
  }
}
