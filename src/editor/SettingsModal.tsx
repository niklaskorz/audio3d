/**
 * @author Niklas Korz
 */
import React from "react";
import styled from "styled-components";
import Project from "../project/Project";
import DistanceModel from "../audio/DistanceModel";
import { Group, Input, InputGroup, Select } from "./styled";
import Modal from "./Modal";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  onDismiss(): void;
  onDistanceModelChange(distanceModel: DistanceModel): void;
  getDistanceModel(): DistanceModel;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {
  distanceModelText: string;
}

export default class SettingsModal extends React.Component<Props, State> {
  state: State = {
    distanceModelText: "inverse"
  };

  constructor(props: Props) {
    super(props);
    switch (this.props.getDistanceModel()) {
      case DistanceModel.linear:
        this.state = { distanceModelText: "linear" };
        break;
      case DistanceModel.inverse:
        this.state = { distanceModelText: "inverse" };
        break;
      case DistanceModel.exponential:
        this.state = { distanceModelText: "exponential" };
        break;
    }
  }

  dismiss = () => {
    this.props.onDismiss();
  };

  selectDistanceModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ distanceModelText: e.currentTarget.value });
    switch (e.currentTarget.value) {
      case "linear":
        this.props.onDistanceModelChange(DistanceModel.linear);
        break;
      case "inverse":
        this.props.onDistanceModelChange(DistanceModel.inverse);
        break;
      case "exponential":
        this.props.onDistanceModelChange(DistanceModel.exponential);
        break;
    }
  };

  render(): React.ReactNode {
    return (
      <Modal onDismiss={this.dismiss} title="Settings">
        Web Audio API <br />
        <Group>
          <label>Distance Model</label>
          <Select
            value={this.state.distanceModelText}
            onChange={this.selectDistanceModel}
          >
            <option value="linear">Linear</option>
            <option value="inverse">Inverse</option>
            <option value="exponential">Exponential</option>
          </Select>
        </Group>
        <br />
        Binaural FIR <br />
        Resonance Audio <br />
      </Modal>
    );
  }
}
