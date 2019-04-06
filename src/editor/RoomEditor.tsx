/**
 * @author Niklas Korz
 */
import React from "react";
import { RoomDimensions } from "resonance-audio";
import { Group, Input, InputGroup } from "./styled";
import { EditorRoom } from "./types";

interface Props {
  room: EditorRoom;
  onUpdateName(name: string): void;
  onUpdateDimensions(dimensions: RoomDimensions): void;
}

// UI component for editing properties specific to a room itself
export default class RoomEditor extends React.Component<Props> {
  render(): React.ReactNode {
    const { room: r, onUpdateName, onUpdateDimensions } = this.props;

    return (
      <div>
        <Group>
          <label>Room Name</label>
          <Input
            type="text"
            value={r.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <label>Dimensions (width, depth, height)</label>
          <InputGroup>
            <Input
              type="number"
              step={1}
              min={5}
              max={50}
              value={r.dimensions.width}
              onChange={e =>
                onUpdateDimensions({
                  ...r.dimensions,
                  width: Math.round(e.currentTarget.valueAsNumber)
                })
              }
            />
            <Input
              type="number"
              step={1}
              min={5}
              max={50}
              value={r.dimensions.depth}
              onChange={e =>
                onUpdateDimensions({
                  ...r.dimensions,
                  depth: Math.round(e.currentTarget.valueAsNumber)
                })
              }
            />
            <Input
              type="number"
              step={1}
              min={2}
              max={10}
              value={r.dimensions.height}
              onChange={e =>
                onUpdateDimensions({
                  ...r.dimensions,
                  height: Math.round(e.currentTarget.valueAsNumber)
                })
              }
            />
          </InputGroup>
        </Group>
      </div>
    );
  }
}
