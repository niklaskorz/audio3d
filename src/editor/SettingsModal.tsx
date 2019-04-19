/**
 * @author Leon Erath
 */
import React from "react";
import DistanceModel from "../audio/DistanceModel";
import Project from "../project/Project";
import { Group, Select } from "./styled";
import Modal from "./Modal";

interface Props {
  project: Project;
  onDismiss(): void;
}

interface State {
  distanceModel: DistanceModel;
}

export default class SettingsModal extends React.Component<Props, State> {
  state = {
    distanceModel: DistanceModel.Linear
  };

  selectDistanceModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { project } = this.props;
    const distanceModel = e.currentTarget.value as DistanceModel;
    project.selectDistanceModel(distanceModel);
    this.setState({ distanceModel });
  };

  componentDidMount(): void {
    this.onProjectChanged();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.project !== this.props.project) {
      this.onProjectChanged();
    }
  }

  onProjectChanged(): void {
    const { project } = this.props;
    this.setState({
      distanceModel: project.distanceModel
    });
  }

  render(): React.ReactNode {
    return (
      <Modal onDismiss={this.props.onDismiss} title="Settings">
        Web Audio API <br />
        <Group>
          <label>Distance Model</label>
          <Select
            value={this.state.distanceModel}
            onChange={this.selectDistanceModel}
          >
            <option value={DistanceModel.Linear}>Linear</option>
            <option value={DistanceModel.Inverse}>Inverse</option>
            <option value={DistanceModel.Exponential}>Exponential</option>
          </Select>
        </Group>
        <br />
        Binaural FIR <br />
        Resonance Audio <br />
      </Modal>
    );
  }
}
