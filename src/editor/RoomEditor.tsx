import React from "react";
import { RoomDimensions } from "resonance-audio";
import { Group, Input } from "./styled";
import { EditorRoom } from "./types";

interface Props {
  room: EditorRoom;
  onUpdateName(name: string): void;
  onUpdateDimensions(dimensions: RoomDimensions): void;
}

export default class RoomEditor extends React.Component<Props> {
  render(): React.ReactNode {
    const { room: r, onUpdateName, onUpdateDimensions } = this.props;

    return (
      <div>
        <Group>
          <label>Name</label>
          <Input
            type="text"
            value={r.name}
            onChange={e => onUpdateName(e.currentTarget.value)}
          />
        </Group>
        <Group>
          <label>Dimensions (width, depth, height)</label>
          <Input
            type="number"
            step={1}
            min={5}
            max={50}
            value={r.dimensions.width}
            onChange={e =>
              onUpdateDimensions({
                ...r.dimensions,
                width: e.currentTarget.valueAsNumber
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
                depth: e.currentTarget.valueAsNumber
              })
            }
          />
          <Input
            type="number"
            step={1}
            min={3}
            max={50}
            value={r.dimensions.height}
            onChange={e =>
              onUpdateDimensions({
                ...r.dimensions,
                height: e.currentTarget.valueAsNumber
              })
            }
          />
        </Group>
      </div>
    );
  }
}
