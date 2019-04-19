/**
 * @author Leon Erath
 * @author Daniel Salomon
 * @author Niklas Korz
 */
import React from "react";
import styled from "styled-components";
import DistanceModel from "../audio/DistanceModel";
import Project from "../project/Project";
import { Group, Select, Hint, CustomInput, BoldLabel } from "./styled";
import Modal, { Action, ActionGroup } from "./Modal";
import AudioLibraryModal from "./AudioLibraryModal";
import { AudioEntry } from "./types";

const InnerContainer = styled.div`
  overflow: auto;
  max-height: 400px;
  /* Add some space between content and scrollbar */
  padding: 0 10px;
  margin: 0 -10px;
`;

enum AudioSelectionTarget {
  Footstep,
  Collision,
  InteractAvail
}

interface Props {
  project: Project;
  onDismiss(): void;
}

interface State {
  distanceModel: DistanceModel;
  footstepAudio?: AudioEntry;
  collisionAudio?: AudioEntry;
  interactAvailAudio?: AudioEntry;
  audioSelectionTarget?: AudioSelectionTarget;
}

export default class SettingsModal extends React.Component<Props, State> {
  state: State = {
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
      distanceModel: project.distanceModel,
      footstepAudio:
        project.footstepAudioID != null && project.footstepAudioFile
          ? {
              ...project.footstepAudioFile,
              id: project.footstepAudioID
            }
          : undefined,
      collisionAudio:
        project.collisionAudioID != null && project.collisionAudioFile
          ? {
              ...project.collisionAudioFile,
              id: project.collisionAudioID
            }
          : undefined,
      interactAvailAudio:
        project.interactAvailAudioID != null && project.interactAvailAudioFile
          ? {
              ...project.interactAvailAudioFile,
              id: project.interactAvailAudioID
            }
          : undefined
    });
  }

  hideAudioSelection = () => {
    this.setState({ audioSelectionTarget: undefined });
  };

  selectAudio = (entry: AudioEntry) => {
    const { project } = this.props;

    switch (this.state.audioSelectionTarget) {
      case AudioSelectionTarget.Footstep:
        project.setFootstepAudio(entry.id);
        this.setState({ footstepAudio: entry });
        break;
      case AudioSelectionTarget.Collision:
        project.setCollisionAudio(entry.id);
        this.setState({ collisionAudio: entry });
        break;
      case AudioSelectionTarget.InteractAvail:
        project.setInteractAvailAudio(entry.id);
        this.setState({ interactAvailAudio: entry });
        break;
    }

    this.hideAudioSelection();
  };

  render(): React.ReactNode {
    const { project, onDismiss } = this.props;
    const {
      footstepAudio,
      collisionAudio,
      interactAvailAudio,
      audioSelectionTarget
    } = this.state;

    if (audioSelectionTarget != null) {
      return (
        <AudioLibraryModal
          audioLibrary={project.audioLibrary}
          onDismiss={this.hideAudioSelection}
          onSelect={this.selectAudio}
        />
      );
    }

    return (
      <Modal onDismiss={onDismiss} title="Settings">
        <InnerContainer>
          <Group>
            <BoldLabel>General</BoldLabel>
            <Group>
              <label>Footstep sound</label>
              <CustomInput
                onClick={() =>
                  this.setState({
                    audioSelectionTarget: AudioSelectionTarget.Footstep
                  })
                }
              >
                {footstepAudio
                  ? `${footstepAudio.name} (${Math.ceil(
                      footstepAudio.data.byteLength / 1024
                    )} KiB)`
                  : "No audio selected"}
              </CustomInput>
            </Group>
            <Group>
              <label>Collision sound</label>
              <CustomInput
                onClick={() =>
                  this.setState({
                    audioSelectionTarget: AudioSelectionTarget.Collision
                  })
                }
              >
                {collisionAudio
                  ? `${collisionAudio.name} (${Math.ceil(
                      collisionAudio.data.byteLength / 1024
                    )} KiB)`
                  : "No audio selected"}
              </CustomInput>
            </Group>
            <Group>
              <label>Interaction available sound</label>
              <CustomInput
                onClick={() =>
                  this.setState({
                    audioSelectionTarget: AudioSelectionTarget.InteractAvail
                  })
                }
              >
                {interactAvailAudio
                  ? `${interactAvailAudio.name} (${Math.ceil(
                      interactAvailAudio.data.byteLength / 1024
                    )} KiB)`
                  : "No audio selected"}
              </CustomInput>
            </Group>
          </Group>
          <Group>
            <BoldLabel>Web Audio API</BoldLabel>
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
          </Group>
          <Group>
            <BoldLabel>Resonance Audio</BoldLabel>
          </Group>
          <Group>
            <BoldLabel>BinauralFIR</BoldLabel>
            <Hint>
              There are no settings currently available for the BinauralFIR
              implementation.
            </Hint>
          </Group>
        </InnerContainer>
        <ActionGroup>
          <Action onClick={onDismiss}>Done</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
