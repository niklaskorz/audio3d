/**
 * @author Niklas Korz
 */
import React from "react";
import { degToRad, radToDeg, roundToPrecision } from "../utils/math";
import { InteractionType, TeleportTarget } from "../project/GameObject";
import Room from "../project/Room";
import {
  Group,
  Input,
  InputGroup,
  CustomInput,
  Select,
  CodeEditor,
  Hint
} from "./styled";
import { EditorObject } from "./types";

interface Props {
  object: EditorObject;
  rooms: Room[];
  onUpdateVolume(volume: number): void;
  onUpdateName(name: string): void;
  onUpdatePosition(x: number, y: number, z: number): void;
  onUpdateRotation(x: number, y: number, z: number): void;
  onUpdateScale(x: number, y: number, z: number): void;
  onUpdateInteractionType(interactionType: InteractionType): void;
  onUpdateCodeBlockSource(source: string): void;
  onUpdateTeleportTarget(teleportTarget: TeleportTarget): void;
  onShowAudioSelection(): void;
  onShowInteractionAudioSelection(): void;
}

interface State {
  codeError?: string;
  volume: number;
}

// UI component for editing properties specific to objects inside a room
export default class ObjectEditor extends React.Component<Props, State> {
  codeCheckTimeout: number | null = null;
  state: State = {
    volume: 0.5
  };

  checkCode = () => {
    const { codeBlockSource } = this.props.object;
    if (codeBlockSource == null) {
      return;
    }

    try {
      // Try to parse the code block source
      new Function("playerState", "roomState", codeBlockSource);
      this.setState({ codeError: undefined });
    } catch (ex) {
      this.setState({ codeError: ex.toString() });
    }
  };

  updateCodeBlockSource: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    this.props.onUpdateCodeBlockSource(e.currentTarget.value);
    if (this.codeCheckTimeout != null) {
      window.clearTimeout(this.codeCheckTimeout);
    }
    this.codeCheckTimeout = window.setTimeout(this.checkCode, 2000);
  };

  updateTeleportTargetRoomId: React.ChangeEventHandler<
    HTMLSelectElement
  > = e => {
    const roomId = e.currentTarget.value;
    this.props.onUpdateTeleportTarget({ roomId, spawnId: "" });
  };

  updateTeleportTargetSpawnId: React.ChangeEventHandler<
    HTMLSelectElement
  > = e => {
    const { object: o, onUpdateTeleportTarget } = this.props;
    if (o.teleportTarget) {
      const spawnId = e.currentTarget.value;
      onUpdateTeleportTarget({ ...o.teleportTarget, spawnId });
    }
  };

  componentDidMount(): void {
    this.checkCode();
  }

  componentWillUnmount(): void {
    if (this.codeCheckTimeout != null) {
      window.clearTimeout(this.codeCheckTimeout);
      this.codeCheckTimeout = null;
    }
  }

  render(): React.ReactNode {
    const {
      object: o,
      rooms,
      onUpdateName,
      onUpdatePosition,
      onUpdateRotation,
      onUpdateVolume,
      onUpdateScale,
      onUpdateInteractionType,
      onShowAudioSelection,
      onShowInteractionAudioSelection
    } = this.props;
    const { codeError } = this.state;
    const teleportTargetRoom =
      o.teleportTarget && rooms.find(r => r.uuid === o.teleportTarget!.roomId);

    return (
      <div>
        <Group>
          <label>Object Name</label>
          <Input
            type="text"
            placeholder="New object"
            value={o.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <label>Volume</label>
          <Input
            type="number"
            step={0.01}
            value={o.volume}
            onChange={e => onUpdateVolume(parseInt(e.currentTarget.value))}
          />
        </Group>
        <Group>
          <label>Position (x, y, z)</label>
          <InputGroup>
            <Input
              type="number"
              step={0.01}
              value={o.position.x.toFixed(2)}
              onChange={e =>
                onUpdatePosition(
                  roundToPrecision(e.currentTarget.valueAsNumber, 0.01),
                  o.position.y,
                  o.position.z
                )
              }
            />
            <Input
              type="number"
              step={0.01}
              value={o.position.y.toFixed(2)}
              onChange={e =>
                onUpdatePosition(
                  o.position.x,
                  roundToPrecision(e.currentTarget.valueAsNumber, 0.01),
                  o.position.z
                )
              }
            />
            <Input
              type="number"
              step={0.01}
              value={o.position.z.toFixed(2)}
              onChange={e =>
                onUpdatePosition(
                  o.position.x,
                  o.position.y,
                  roundToPrecision(e.currentTarget.valueAsNumber, 0.01)
                )
              }
            />
          </InputGroup>
        </Group>
        <Group>
          <label>Euler-Rotation in Degrees (x, y, z)</label>
          <InputGroup>
            <Input
              type="number"
              step={1}
              value={radToDeg(o.rotation.x).toFixed(0)}
              onChange={e =>
                onUpdateRotation(
                  degToRad(e.currentTarget.valueAsNumber % 360),
                  o.rotation.y,
                  o.rotation.z
                )
              }
            />
            <Input
              type="number"
              step={1}
              value={radToDeg(o.rotation.y).toFixed(0)}
              onChange={e =>
                onUpdateRotation(
                  o.rotation.x,
                  degToRad(e.currentTarget.valueAsNumber % 360),
                  o.rotation.z
                )
              }
            />
            <Input
              type="number"
              step={1}
              value={radToDeg(o.rotation.z).toFixed(0)}
              onChange={e =>
                onUpdateRotation(
                  o.rotation.x,
                  o.rotation.y,
                  degToRad(e.currentTarget.valueAsNumber % 360)
                )
              }
            />
          </InputGroup>
        </Group>
        <Group>
          <label>Size (width, height, depth)</label>
          <InputGroup>
            <Input
              type="number"
              step={0.1}
              min={0.1}
              max={10}
              value={o.scale.x.toFixed(1)}
              onChange={e =>
                onUpdateScale(
                  e.currentTarget.valueAsNumber,
                  o.scale.y,
                  o.scale.z
                )
              }
            />
            <Input
              type="number"
              step={0.1}
              min={0.1}
              max={10}
              value={o.scale.y.toFixed(1)}
              onChange={e =>
                onUpdateScale(
                  o.scale.x,
                  e.currentTarget.valueAsNumber,
                  o.scale.z
                )
              }
            />
            <Input
              type="number"
              step={0.1}
              min={0.1}
              max={10}
              value={o.scale.z.toFixed(1)}
              onChange={e =>
                onUpdateScale(
                  o.scale.x,
                  o.scale.y,
                  e.currentTarget.valueAsNumber
                )
              }
            />
          </InputGroup>
        </Group>
        <Group>
          <label>Audio</label>
          <CustomInput onClick={onShowAudioSelection}>
            {o.audio
              ? `${o.audio.name} (${Math.ceil(
                  o.audio.data.byteLength / 1024
                )} KiB)`
              : "No audio selected"}
          </CustomInput>
        </Group>
        <Group>
          <label>Interaction</label>
          <Select
            value={o.interactionType}
            onChange={e =>
              onUpdateInteractionType(e.currentTarget.value as InteractionType)
            }
          >
            {Object.values(InteractionType).map(t => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          {o.interactionType === InteractionType.CodeBlock && (
            <>
              <CodeEditor
                placeholder="// JavaScript"
                value={o.codeBlockSource}
                onChange={this.updateCodeBlockSource}
              />
              <Hint>{codeError || "No syntax errors detected"}</Hint>
            </>
          )}
          {o.interactionType === InteractionType.Teleport && o.teleportTarget && (
            <Group>
              <label>Teleport Target</label>
              <Select
                value={o.teleportTarget.roomId}
                onChange={this.updateTeleportTargetRoomId}
              >
                {rooms.map(r => (
                  <option key={r.uuid} value={r.uuid}>
                    {r.name || "Anonymous Room"}
                  </option>
                ))}
              </Select>
              {teleportTargetRoom && (
                <Select
                  value={o.teleportTarget.spawnId}
                  onChange={this.updateTeleportTargetSpawnId}
                >
                  {teleportTargetRoom.spawns.map(s => (
                    <option key={s.uuid} value={s.uuid}>
                      {s.name || "New spawn"}
                    </option>
                  ))}
                </Select>
              )}
            </Group>
          )}
          {o.interactionType !== InteractionType.None &&
            o.interactionType !== InteractionType.CodeBlock && (
              <Group>
                <label>Interaction Sound</label>
                <CustomInput onClick={onShowInteractionAudioSelection}>
                  {o.interactionAudio
                    ? `${o.interactionAudio.name} (${Math.ceil(
                        o.interactionAudio.data.byteLength / 1024
                      )} KiB)`
                    : "No audio selected"}
                </CustomInput>
              </Group>
            )}
        </Group>
      </div>
    );
  }
}
