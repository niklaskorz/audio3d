/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions, RoomMaterials } from "resonance-audio";
import { Euler, Vector3 } from "three";
import { saveAsZip } from "../data/export";
import { openZip } from "../data/import";
import GameObject, {
  InteractionType,
  TeleportTarget
} from "../project/GameObject";
import Project from "../project/Project";
import { ProjectData } from "../data/schema";
import AudioImplementation from "../audio/AudioImplementation";
import RuntimeContainer from "../runtime/RuntimeContainer";
import CodeBlock from "../project/CodeBlock";
import SpawnMarker from "../project/SpawnMarker";
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
import { EditorObject, EditorRoom, AudioEntry, EditorSpawn } from "./types";
import ProjectManagerModal from "./ProjectManagerModal";
import SpawnEditor from "./SpawnEditor";

enum ModalType {
  AudioLibrary,
  AudioSelection,
  ProjectManager,
  ProjectSelection
}

enum AudioSelectionTarget {
  ObjectAudio,
  InteractionAudio
}

interface State {
  audioImplementation: AudioImplementation;
  rooms: EditorRoom[];
  selectedRoomId: number;
  selectedSpawn: EditorSpawn | null;
  selectedObject: EditorObject | null;
  modal: ModalType | null;
  runningProject: Project | null;
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
    selectedSpawn: null,
    selectedObject: null,
    modal: null,
    runningProject: null
  };
  audioSelectionTarget = AudioSelectionTarget.ObjectAudio;
  mainRef = React.createRef<HTMLElement>();

  constructor(props: {}) {
    super(props);

    this.project.events = {
      onSelectSpawn: this.onSelectSpawn,
      onSelectObject: this.onSelectObject,
      onTranslate: this.onTranslateObject,
      onScale: this.onScaleObject
    };
  }

  // Menubar functionality

  newProject = () => {
    this.project.close();
    this.project = new Project({
      onSelectSpawn: this.onSelectSpawn,
      onSelectObject: this.onSelectObject,
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
      selectedSpawn: null,
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
      onSelectSpawn: this.onSelectSpawn,
      onSelectObject: this.onSelectObject,
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
      selectedSpawn: null,
      selectedObject: null
    });
  };

  exportProject = () => {
    saveAsZip(this.project);
  };

  addObject = () => {
    const object = this.project.activeRoom.addObject();
    this.project.selectObject(object);
  };

  deleteObject = () => {
    if (this.project.activeObject) {
      this.project.activeRoom.remove(this.project.activeObject);
      this.project.activeObject.audio.stop();
      this.project.unselect();
    }
  };

  addSpawn = () => {
    const spawn = this.project.activeRoom.addSpawn();
    this.project.selectSpawn(spawn);
  };

  deleteSpawn = () => {
    const { spawns } = this.project.activeRoom;
    // Ensure that at least one spawn per room exists, as it is used
    // as a fallback when a requested spawn does not exist.
    if (this.project.activeSpawn && spawns.length > 1) {
      spawns.splice(spawns.indexOf(this.project.activeSpawn));
      this.project.activeRoom.remove(this.project.activeSpawn);
      this.project.activeSpawn = null;
      this.project.unselect();
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
    // Copy project so any changes made during runtime are not persisted
    const runningProject = new Project().fromData(
      this.project.toData(),
      this.project.id
    );
    runningProject.audioLibrary = this.project.audioLibrary;
    this.project.suspend();
    this.setState({ runningProject });
  };

  // Room specific editor functionality

  selectRoom(id: number): void {
    this.project.selectRoom(this.project.rooms[id]);
    this.setState({ selectedRoomId: id });
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

  // Spawn editor functionality

  updateSpawnName = (name: string) => {
    if (this.project.activeSpawn) {
      this.project.activeSpawn.name = name;
    }
    this.setState(({ selectedSpawn }) => ({
      selectedSpawn: selectedSpawn && {
        ...selectedSpawn,
        name
      }
    }));
  };

  updateSpawnPosition = (x: number, z: number) => {
    if (this.project.activeSpawn) {
      this.project.activeSpawn.position.x = x;
      this.project.activeSpawn.position.z = z;
    }
    this.setState(({ selectedSpawn }) => ({
      selectedSpawn: selectedSpawn && {
        ...selectedSpawn,
        position: new Vector3(x, 0, z)
      }
    }));
  };

  updateSpawnRotation = (y: number) => {
    if (this.project.activeSpawn) {
      this.project.activeSpawn.rotation.y = y;
    }
    this.setState(({ selectedSpawn }) => ({
      selectedSpawn: selectedSpawn && {
        ...selectedSpawn,
        rotation: y
      }
    }));
  };

  // Object editor functionality

  updateObjectName = (name: string) => {
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

  updateObjectScale = (x: number, y: number, z: number) => {
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

  updateObjectPosition = (x: number, y: number, z: number) => {
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

  updateObjectRotation = (x: number, y: number, z: number) => {
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

  updateObjectInteractionType = (interactionType: InteractionType) => {
    const defaultTarget: TeleportTarget = {
      roomId: this.project.rooms[0].uuid,
      spawnId: ""
    };
    if (this.project.activeObject) {
      this.project.activeObject.interactionType = interactionType;
      this.project.activeObject.teleportTarget =
        this.project.activeObject.teleportTarget || defaultTarget;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        interactionType,
        teleportTarget: selectedObject.teleportTarget || defaultTarget
      }
    }));
  };

  updateObjectCodeBlockSource = (codeBlockSource: string) => {
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

  updateObjectTeleportTarget = (teleportTarget: TeleportTarget) => {
    if (this.project.activeObject) {
      this.project.activeObject.teleportTarget = teleportTarget;
    }
    this.setState(({ selectedObject }) => ({
      selectedObject: selectedObject && {
        ...selectedObject,
        teleportTarget
      }
    }));
  };

  showAudioSelection = () => {
    this.audioSelectionTarget = AudioSelectionTarget.ObjectAudio;
    this.setState({
      modal: ModalType.AudioSelection
    });
  };

  showInteractionAudioSelection = () => {
    this.audioSelectionTarget = AudioSelectionTarget.InteractionAudio;
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
      if (this.audioSelectionTarget === AudioSelectionTarget.InteractionAudio) {
        this.project.activeObject.interactionAudioId = audio.id;
        this.setState(({ selectedObject }) => ({
          selectedObject: selectedObject && {
            ...selectedObject,
            interactionAudio: audio
          },
          modal: null
        }));
      } else {
        this.project.activeObject.playAudio(audio.id, true);
        this.setState(({ selectedObject }) => ({
          selectedObject: selectedObject && {
            ...selectedObject,
            audio
          },
          modal: null
        }));
      }
    }
  };

  loadProject = (data: ProjectData) => {
    this.project.close();
    this.project = new Project().fromData(data, data.id);
    this.project.events = {
      onSelectSpawn: this.onSelectSpawn,
      onSelectObject: this.onSelectObject,
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
      selectedSpawn: null,
      selectedObject: null,
      modal: null
    });
  };

  // Project canvas events

  onSelectSpawn = (s: SpawnMarker | null) => {
    this.setState({
      selectedSpawn: s && {
        id: s.id,
        name: s.name,
        position: s.position,
        rotation: s.rotation.y
      },
      selectedObject: null
    });
  };

  onSelectObject = async (o: GameObject | null) => {
    const interactionAudio =
      o && o.interactionAudioId != null
        ? await this.project.audioLibrary.get(o.interactionAudioId)
        : undefined;
    this.setState({
      selectedSpawn: null,
      selectedObject: o && {
        id: o.id,
        name: o.name,
        position: o.position,
        scale: o.scale,
        rotation: o.rotation,
        audio:
          o.audioFile && o.audioId != null
            ? {
                ...o.audioFile,
                id: o.audioId
              }
            : undefined,
        interactionType: o.interactionType,
        codeBlockSource: o.codeBlock && o.codeBlock.source,
        teleportTarget: o.teleportTarget,
        interactionAudio:
          interactionAudio && o.interactionAudioId != null
            ? {
                ...interactionAudio,
                id: o.interactionAudioId
              }
            : undefined
      }
    });
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
    if (!this.state.runningProject) {
      return;
    }
    const { activeAudioImplementation } = this.state.runningProject;
    this.state.runningProject.close();
    this.project.selectAudioImplementation(activeAudioImplementation);
    this.setState({
      runningProject: null,
      audioImplementation: activeAudioImplementation
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
    const { modal, runningProject, audioImplementation } = this.state;
    const { selectedSpawn: s, selectedObject: o } = this.state;

    if (runningProject) {
      return (
        <RuntimeContainer project={runningProject} onExit={this.exitRuntime} />
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
          onAddSpawn={this.addSpawn}
          onDeleteSpawn={this.deleteSpawn}
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
            {!(s || o) && (
              <RoomEditor
                room={this.state.rooms[this.state.selectedRoomId]}
                onUpdateName={this.updateRoomName}
                onUpdateDimensions={this.updateRoomDimensions}
                onUpdateMaterials={this.updateRoomMaterials}
              />
            )}
            {s && (
              <SpawnEditor
                spawn={s}
                onUpdateName={this.updateSpawnName}
                onUpdatePosition={this.updateSpawnPosition}
                onUpdateRotation={this.updateSpawnRotation}
              />
            )}
            {o && (
              <ObjectEditor
                object={o}
                rooms={this.project.rooms}
                onUpdateName={this.updateObjectName}
                onUpdatePosition={this.updateObjectPosition}
                onUpdateRotation={this.updateObjectRotation}
                onUpdateScale={this.updateObjectScale}
                onUpdateInteractionType={this.updateObjectInteractionType}
                onUpdateCodeBlockSource={this.updateObjectCodeBlockSource}
                onUpdateTeleportTarget={this.updateObjectTeleportTarget}
                onShowAudioSelection={this.showAudioSelection}
                onShowInteractionAudioSelection={
                  this.showInteractionAudioSelection
                }
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
