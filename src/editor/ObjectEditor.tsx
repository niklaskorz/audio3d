/**
 * @author Niklas Korz
 */
import React from "react";
import { degToRad, radToDeg, roundToPrecision } from "../utils/math";
import { InteractionType } from "../project/GameObject";
import {
  Group,
  Input,
  InputGroup,
  CustomInput,
  Select,
  CodeEditor
} from "./styled";
import { EditorObject } from "./types";

interface Props {
  object: EditorObject;
  onUpdateName(name: string): void;
  onUpdatePosition(x: number, y: number, z: number): void;
  onUpdateRotation(x: number, y: number, z: number): void;
  onUpdateScale(x: number, y: number, z: number): void;
  onUpdateInteractionType(interactionType: InteractionType): void;
  onUpdateCodeBlockSource(source: string): void;
  onShowAudioSelection(): void;
}

interface State {
  codeError?: string;
}

// UI component for editing properties specific to objects inside a room
export default class ObjectEditor extends React.Component<Props, State> {
  codeCheckTimeout: number | null = null;
  state: State = {};

  checkCode = () => {
    const { codeBlockSource } = this.props.object;
    if (!codeBlockSource) {
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
    window.setTimeout(this.checkCode, 2000);
  };

  render(): React.ReactNode {
    const {
      object: o,
      onUpdateName,
      onUpdatePosition,
      onUpdateRotation,
      onUpdateScale,
      onUpdateInteractionType,
      onShowAudioSelection
    } = this.props;
    const { codeError } = this.state;

    return (
      <div>
        <Group>
          <label>Object Name</label>
          <Input
            type="text"
            value={o.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
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
              : "None"}
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
                value={o.codeBlockSource}
                onChange={this.updateCodeBlockSource}
              />
              <p>{codeError || "No syntax errors detected"}</p>
            </>
          )}
        </Group>
      </div>
    );
  }
}
