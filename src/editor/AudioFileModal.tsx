/**
 * @author Niklas Korz
 */
import React from "react";
import Modal, { ActionGroup, Action } from "./Modal";
import { AudioEntry } from "./types";

interface Props {
  audioEntry: AudioEntry;
  onDelete(audioEntry: AudioEntry): void;
  onExport(audioEntry: AudioEntry): void;
  onDismiss(): void;
  onCancel(): void;
}

export default class AudioFileModal extends React.Component<Props> {
  render(): React.ReactNode {
    const { audioEntry } = this.props;
    return (
      <Modal title="Audio File" onDismiss={this.props.onDismiss}>
        <p>
          <b>Name:</b> {audioEntry.name}
        </p>
        <p>
          <b>Type:</b> {audioEntry.type}
        </p>
        <p>
          <b>Size:</b> {Math.ceil(audioEntry.data.byteLength / 1024)} KiB
        </p>
        <ActionGroup>
          <Action onClick={() => this.props.onDelete(audioEntry)}>
            Delete
          </Action>
          <Action onClick={() => this.props.onExport(audioEntry)}>
            Export
          </Action>
          <Action onClick={this.props.onCancel}>Back</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
