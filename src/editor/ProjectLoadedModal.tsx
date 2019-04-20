/**
 * @author Niklas Korz
 */
import React from "react";
import Modal, { ActionGroup, Action } from "./Modal";

interface Props {
  onConfirm(): void;
}

// Many browsers block automatic playback of audio nowadays.
// In particular, this means that any audio playback that is started
// outside of an user interaction event handler will be stopped.
// As the functions for loading or importing projects are asynchronous,
// they are considered to be running outside of the user interaction event handler.
// Therefore, we have to display this dialog after a project has been loaded and
// resume the loaded project's audio when the user clicks on the "OK" buttion in this
// dialog.
export default class ProjectLoadedModal extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <Modal title="Project Loaded">
        <p>The project has been loaded successfully.</p>
        <ActionGroup>
          <Action onClick={this.props.onConfirm}>OK</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
