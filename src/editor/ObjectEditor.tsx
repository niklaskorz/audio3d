/**
 * @author Niklas Korz
 */
import React from "react";
import { Group, Input } from "./styled";
import { EditorObject } from "./types";

interface Props {
  object: EditorObject;
  onUpdateName(name: string): void;
  onUpdatePosition(x: number, y: number, z: number): void;
  onUpdateRotation(x: number, y: number, z: number): void;
  onUpdateScale(x: number, y: number, z: number): void;
  onUpdateAudio(data: ArrayBuffer): void;
}

// Converts radiant angles to degrees
const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

// Converts degree angles to radiants
const degToRad = (deg: number): number => (deg / 180) * Math.PI;

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
          <label>Name</label>
          <Input
            type="text"
            value={o.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <label>Position (x, y, z)</label>
          <Input
            type="number"
            step="any"
            value={o.position.x}
            onChange={e =>
              onUpdatePosition(
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
              onUpdatePosition(
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
              onUpdatePosition(
                o.position.x,
                o.position.y,
                e.currentTarget.valueAsNumber
              )
            }
          />
        </Group>
        <Group>
          <label>Euler-Rotation in Degrees (x, y, z)</label>
          <Input
            type="number"
            step={1}
            value={radToDeg(o.rotation.x).toFixed(0)}
            onChange={e =>
              onUpdateRotation(
                degToRad(e.currentTarget.valueAsNumber),
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
                degToRad(e.currentTarget.valueAsNumber),
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
                degToRad(e.currentTarget.valueAsNumber)
              )
            }
          />
        </Group>
        <Group>
          <label>Size (width, height, depth)</label>
          <Input
            type="number"
            step="any"
            min={0.1}
            max={10}
            value={o.scale.x}
            onChange={e =>
              onUpdateScale(e.currentTarget.valueAsNumber, o.scale.y, o.scale.z)
            }
          />
          <Input
            type="number"
            step="any"
            min={0.1}
            max={10}
            value={o.scale.y}
            onChange={e =>
              onUpdateScale(o.scale.x, e.currentTarget.valueAsNumber, o.scale.z)
            }
          />
          <Input
            type="number"
            step="any"
            min={0.1}
            max={10}
            value={o.scale.z}
            onChange={e =>
              onUpdateScale(o.scale.x, o.scale.y, e.currentTarget.valueAsNumber)
            }
          />
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