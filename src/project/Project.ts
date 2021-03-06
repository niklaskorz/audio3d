/**
 * @author Niklas Korz
 * @author Leon Erath
 * @author Daniel Salomon
 */
import {
  BackSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Vector3
} from "three";
import { ResonanceAudio } from "resonance-audio";
import Serializable, { SerializedData } from "../data/Serializable";
import { ProjectData, AudioFile } from "../data/schema";
import { saveProject } from "../data/db";
import AudioImplementation from "../audio/AudioImplementation";
import defaultAudioContext from "../audio/defaultAudioContext";
import AudioLibrary from "./AudioLibrary";
import GameObject from "./GameObject";
import Room from "./Room";
import SpawnMarker from "./SpawnMarker";

export interface ProjectEvents {
  onSelectSpawn(spawnMarker: SpawnMarker | null): void;
  onSelectObject(object: GameObject | null): void;
  onTranslate(position: Vector3): void;
  onScale(scale: Vector3): void;
}

const noop = (): void => {
  /* no operation */
};

const defaultEvents: ProjectEvents = {
  onSelectSpawn: noop,
  onSelectObject: noop,
  onScale: noop,
  onTranslate: noop
};

export default class Project implements Serializable {
  events: ProjectEvents;
  audioLibrary = new AudioLibrary();

  id?: number;
  name = "New project";
  rooms: Room[] = [];

  panningModel: PanningModelType = "equalpower";
  distanceModel: DistanceModelType = "inverse";
  ambisonicOrder = ResonanceAudio.Utils.DEFAULT_AMBISONIC_ORDER;
  rollofModel = ResonanceAudio.Utils.DEFAULT_ATTENUATION_ROLLOFF;

  playerHeight = 1.8; // 1.80m player height, eyes are ~10cm lower
  playerState = new Map<string, any>(); // Needed by runtime

  collisionAudioId?: number; // Audio IDs, Files and buffer for collision/footstep/interaction sounds
  footstepAudioId?: number;
  interactAvailAudioId?: number;
  collisionAudioFile?: AudioFile;
  footstepAudioFile?: AudioFile;
  interactAvailAudioFile?: AudioFile;
  collisionAudioBuffer?: AudioBuffer;
  footstepAudioBuffer?: AudioBuffer;
  interactAvailAudioBuffer?: AudioBuffer;

  activeAudioImplementation = AudioImplementation.WebAudio;
  activeRoom: Room;
  activeSpawn: SpawnMarker | null = null;
  activeObject: GameObject | null = null;

  outlineMesh = new Mesh();

  get camera(): PerspectiveCamera {
    return this.activeRoom.camera;
  }

  constructor(events: ProjectEvents = defaultEvents) {
    this.events = events;

    const firstRoom = new Room(this, this.audioLibrary, "First room");
    firstRoom.addSpawn();
    firstRoom.addObject();
    this.rooms.push(firstRoom);
    this.activeRoom = firstRoom;

    this.outlineMesh.material = new MeshBasicMaterial({
      color: 0xffffff,
      side: BackSide
    });
    this.outlineMesh.scale.multiplyScalar(1.05);
  }

  close(): void {
    for (const room of this.rooms) {
      room.audioScene.close();
    }
  }

  suspend(): void {
    this.activeRoom.audioScene.suspend();
  }

  resume(): void {
    this.activeRoom.audioScene.resume();
  }

  addRoom(): Room {
    const room = new Room(this, this.audioLibrary, "New room");
    room.addSpawn();
    room.addObject();

    // Options
    room.audioScene.resonanceScene.setAmbisonicOrder(this.ambisonicOrder);

    if (this.collisionAudioBuffer)
      room.collisionAudio.setBuffer(this.collisionAudioBuffer);
    if (this.footstepAudioBuffer)
      room.footstepAudio.setBuffer(this.footstepAudioBuffer);
    if (this.interactAvailAudioBuffer)
      room.interactAvailAudio.setBuffer(this.interactAvailAudioBuffer);

    this.rooms.push(room);
    this.selectRoom(room);
    return room;
  }

  selectPanningModel(model: PanningModelType): void {
    for (const room of this.rooms) {
      for (const obj of room.children) {
        if (obj instanceof GameObject) {
          obj.audio.webAudioPannerNode.panningModel = model;
        }
      }
    }
    this.panningModel = model;
  }

  selectDistanceModel(distanceModel: DistanceModelType): void {
    for (const room of this.rooms) {
      for (const obj of room.children) {
        if (obj instanceof GameObject) {
          obj.audio.webAudioPannerNode.distanceModel = distanceModel;
        }
      }
    }
    this.distanceModel = distanceModel;
  }

  selectAmbisonicOrder(order: number): void {
    for (const room of this.rooms) {
      room.audioScene.resonanceScene.setAmbisonicOrder(order);
    }
    this.ambisonicOrder = order;
  }

  selectRollofModel(model: string): void {
    for (const room of this.rooms) {
      for (const obj of room.children) {
        if (obj instanceof GameObject) {
          obj.audio.resonanceSource.setRolloff(model);
        }
      }
    }
    this.rollofModel = model;
  }

  selectAudioImplementation(audioImplementation: AudioImplementation): void {
    this.activeAudioImplementation = audioImplementation;
    this.activeRoom.audioScene.selectAudioImplementation(audioImplementation);
  }

  selectRoom(room: Room): void {
    this.activeRoom.audioScene.suspend();
    room.audioScene.selectAudioImplementation(this.activeAudioImplementation);
    room.camera.aspect = this.activeRoom.camera.aspect;
    room.camera.updateProjectionMatrix();
    this.activeRoom = room;
    this.unselect();
  }

  unselect(): void {
    if (this.activeSpawn) {
      this.activeSpawn.remove(this.outlineMesh);
      this.activeSpawn = null;
      this.events.onSelectSpawn(null);
    }
    if (this.activeObject) {
      this.activeObject.remove(this.outlineMesh);
      this.activeObject = null;
      this.events.onSelectObject(null);
    }
  }

  selectSpawn(s: SpawnMarker): void {
    this.unselect();

    this.outlineMesh.geometry = s.geometry;
    s.add(this.outlineMesh);

    this.activeSpawn = s;
    this.events.onSelectSpawn(s);
  }

  selectObject(o: GameObject): void {
    this.unselect();

    this.outlineMesh.geometry = o.geometry;
    o.add(this.outlineMesh);

    this.activeObject = o;
    this.events.onSelectObject(o);
  }

  teleportPlayer(roomId: string, spawnId?: string): void {
    const room = this.rooms.find(r => r.uuid === roomId);
    if (room) {
      this.selectRoom(room);
      const spawn =
        (spawnId && room.spawns.find(s => s.uuid === spawnId)) ||
        room.spawns[0];
      room.camera.position.set(
        spawn.position.x,
        this.playerHeight - 0.1,
        spawn.position.z
      );
      room.camera.rotation.set(0, spawn.rotation.y, 0);
    } else {
      console.log("Target room not found, not teleporting");
    }
  }

  async setCollisionAudio(id: number): Promise<void> {
    this.collisionAudioId = id;
    this.collisionAudioFile = await this.audioLibrary.get(id);
    if (this.collisionAudioFile) {
      this.collisionAudioBuffer = await defaultAudioContext.decodeAudioData(
        this.collisionAudioFile.data.slice(0)
      );
      for (const room of this.rooms) {
        room.collisionAudio.setBuffer(this.collisionAudioBuffer);
        room.collisionAudio.setLoop(false);
      }
    } else {
      console.log(
        "Audio with id",
        id,
        "could not be found and can't be played"
      );
    }
  }

  async setFootstepAudio(id: number): Promise<void> {
    this.footstepAudioId = id;
    this.footstepAudioFile = await this.audioLibrary.get(id);
    if (this.footstepAudioFile) {
      this.footstepAudioBuffer = await defaultAudioContext.decodeAudioData(
        this.footstepAudioFile.data.slice(0)
      );
      for (const room of this.rooms) {
        room.footstepAudio.setBuffer(this.footstepAudioBuffer);
        room.footstepAudio.setLoop(false);
      }
    } else {
      console.log(
        "Audio with id",
        id,
        "could not be found and can't be played"
      );
    }
  }

  async setInteractAvailAudio(id: number): Promise<void> {
    this.interactAvailAudioId = id;
    this.interactAvailAudioFile = await this.audioLibrary.get(id);
    if (this.interactAvailAudioFile) {
      this.interactAvailAudioBuffer = await defaultAudioContext.decodeAudioData(
        this.interactAvailAudioFile.data.slice(0)
      );
      for (const room of this.rooms) {
        room.interactAvailAudio.setBuffer(this.interactAvailAudioBuffer);
        room.interactAvailAudio.setLoop(false);
      }
    } else {
      console.log(
        "Audio with id",
        id,
        "could not be found and can't be played"
      );
    }
  }

  async save(): Promise<void> {
    const id = await saveProject(this);
    if (this.id == null) {
      this.id = id;
      await this.audioLibrary.saveToProject(id);
    }
  }

  // Serialize instance to a plain JavaScript object
  toData(): ProjectData {
    return {
      savedAt: new Date(),
      name: this.name,
      rooms: this.rooms.map(r => r.toData()),
      nextAudioId: this.audioLibrary.nextId,

      audioImplementation: this.activeAudioImplementation,

      panningModel: this.panningModel,
      distanceModel: this.distanceModel,
      ambisonicOrder: this.ambisonicOrder,
      rollofModel: this.rollofModel,

      collisionAudioId: this.collisionAudioId,
      footstepAudioId: this.footstepAudioId,
      interactAvailAudioId: this.interactAvailAudioId
    };
  }

  // Load data from a plain JavaScript object into this instance
  fromData(
    data: SerializedData,
    projectId?: number,
    audioLibrary?: AudioLibrary
  ): this {
    this.id = projectId;
    if (audioLibrary) {
      this.audioLibrary = audioLibrary;
    } else {
      this.audioLibrary.projectId = projectId;
      this.audioLibrary.nextId = data.nextAudioId || 0;
    }

    this.name = data.name;
    this.rooms = data.rooms.map((r: SerializedData) =>
      new Room(this, this.audioLibrary).fromData(r)
    );
    this.activeRoom = this.rooms[0];

    // Disable audio in all inactive rooms
    for (let i = 1; i < this.rooms.length; i++) {
      this.rooms[i].audioScene.suspend();
    }

    if (data.audioImplementation) {
      this.selectAudioImplementation(data.audioImplementation);
    }

    // Project options
    if (data.panningModel) {
      this.selectPanningModel(data.panningModel);
    }
    if (data.distanceModel) {
      this.selectDistanceModel(data.distanceModel);
    }
    if (data.ambisonicOrder) {
      this.selectAmbisonicOrder(data.ambisonicOrder);
    }
    if (data.rollofModel) {
      this.selectRollofModel(data.rollofModel);
    }

    // Set sounds for collision, footstep and interaction available
    if (data.collisionAudioId != null) {
      this.setCollisionAudio(data.collisionAudioId);
    }
    if (data.footstepAudioId != null) {
      this.setFootstepAudio(data.footstepAudioId);
    }
    if (data.interactAvailAudioId != null) {
      this.setInteractAvailAudio(data.interactAvailAudioId);
    }

    return this;
  }
}
