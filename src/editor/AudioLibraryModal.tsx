/**
 * @author Niklas Korz
 */
import React from "react";
import AudioLibrary from "../project/AudioLibrary";
import { openFileDialog, readFileAsArrayBuffer } from "../utils/files";
import Modal, { Action, ActionGroup } from "./Modal";

interface Props {
  audioLibrary: AudioLibrary;
  onDismiss?(): void;
}

export default class AudioLibraryModal extends React.Component<Props> {
  openAudioFileDialog = async () => {
    const file = await openFileDialog({ accept: "audio/*" });
    const data = await readFileAsArrayBuffer(file);
  };

  render(): React.ReactNode {
    const { audioLibrary, onDismiss } = this.props;

    return (
      <Modal title="Audio Library" onDismiss={onDismiss}>
        {audioLibrary.size > 0 &&
          Array.from(this.props.audioLibrary.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([id, audioFile]) => (
              <div>
                {id}: {audioFile.name}
              </div>
            ))}
        {audioLibrary.size === 0 && (
          <div>You haven't added any audio files yet</div>
        )}
        <ActionGroup>
          <Action>Add audio file</Action>
          <Action onClick={onDismiss}>Cancel</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
