/**
 * @author Niklas Korz
 */
import React from "react";
import { degToRad, radToDeg, roundToPrecision } from "../utils/math";
import { Group, Input, InputGroup } from "./styled";
import { EditorObject } from "./types";

interface Props {
  object: EditorObject;
  onUpdateName(name: string): void;
  onUpdatePosition(x: number, y: number, z: number): void;
  onUpdateRotation(x: number, y: number, z: number): void;
  onUpdateScale(x: number, y: number, z: number): void;
  onUpdateAudio(data: ArrayBuffer): void;
}

// UI component for editing properties specific to objects inside a room
export default class ObjectEditor extends React.Component<Props> {
  onAudioFileSelected: React.ChangeEventHandler<HTMLInputElement> = e => {
    const { files } = e.currentTarget;
    if (!files) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      return;
    }
    console.log("Selected file:", file);

    if (file.size > 5 * 1024 * 1024) {
      console.log("File too big, aborting");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        console.error("Failed reading file:", e);
        return;
      }

      this.props.onUpdateAudio(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  };

  render(): React.ReactNode {
    const {
      object: o,
      onUpdateName,
      onUpdatePosition,
      onUpdateRotation,
      onUpdateScale
    } = this.props;

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
          <label>Audio source (file)</label>
          <Input
            type="file"
            accept="audio/*"
            onChange={this.onAudioFileSelected}
          />
        </Group>
      </div>
    );
  }
}
