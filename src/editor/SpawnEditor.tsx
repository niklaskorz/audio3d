/**
 * @author Niklas Korz
 */
import React from "react";
import { degToRad, radToDeg, roundToPrecision } from "../utils/math";
import { selectOnFocus } from "../utils/react";
import { Group, Input, InputGroup } from "./styled";
import { EditorSpawn } from "./types";

interface Props {
  spawn: EditorSpawn;
  onUpdateName(name: string): void;
  onUpdatePosition(x: number, z: number): void;
  onUpdateRotation(y: number): void;
}

// UI component for editing properties specific to spawns inside a room
export default class SpawnEditor extends React.Component<Props> {
  render(): React.ReactNode {
    const {
      spawn: s,
      onUpdateName,
      onUpdatePosition,
      onUpdateRotation
    } = this.props;

    return (
      <div>
        <Group>
          <label>Spawn ID</label>
          <Input type="text" readOnly value={s.uuid} onFocus={selectOnFocus} />
        </Group>
        <Group>
          <label>Name</label>
          <Input
            type="text"
            placeholder="New spawn"
            value={s.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <label>Position (x, z)</label>
          <InputGroup>
            <Input
              type="number"
              step={0.01}
              value={s.position.x.toFixed(2)}
              onChange={e =>
                onUpdatePosition(
                  roundToPrecision(e.currentTarget.valueAsNumber, 0.01),
                  s.position.z
                )
              }
            />
            <Input
              type="number"
              step={0.01}
              value={s.position.z.toFixed(2)}
              onChange={e =>
                onUpdatePosition(
                  s.position.x,
                  roundToPrecision(e.currentTarget.valueAsNumber, 0.01)
                )
              }
            />
          </InputGroup>
        </Group>
        <Group>
          <label>Euler-Rotation in Degrees (y)</label>
          <InputGroup>
            <Input
              type="number"
              step={1}
              value={radToDeg(s.rotation).toFixed(0)}
              onChange={e =>
                onUpdateRotation(degToRad(e.currentTarget.valueAsNumber % 360))
              }
            />
          </InputGroup>
        </Group>
      </div>
    );
  }
}
