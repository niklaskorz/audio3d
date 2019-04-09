/**
 * @author Niklas Korz
 */
import React from "react";
import { saveAs } from "file-saver";
import styled from "styled-components";
import AudioLibrary from "../project/AudioLibrary";
import { openFileDialog, readFileAsArrayBuffer } from "../utils/files";
import AudioFileModal from "./AudioFileModal";
import Modal, { Action, ActionGroup } from "./Modal";
import { AudioEntry } from "./types";

const AudioList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -5px;
`;

const AudioItem = styled.div`
  flex: 1 1 150px;
  margin: 5px;
  padding: 10px 15px;
  border-radius: 3px;
  cursor: pointer;
  background: hsl(210, 29%, 20%);
  transition: 0.2s background-color, 0.2s box-shadow;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  :hover,
  :active {
    background: hsl(210, 29%, 35%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  }
`;

interface Props {
  audioLibrary: AudioLibrary;
  onDismiss(): void;
  onSelect?(entry: AudioEntry): void;
}

interface State {
  entries: AudioEntry[];
  selectedEntry: AudioEntry | null;
}

export default class AudioLibraryModal extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props): Partial<State> {
    return {
      entries: Array.from(props.audioLibrary.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([id, audioFile]) => ({
          id,
          ...audioFile
        }))
    };
  }

  previewAudio = new Audio();
  state: State = { entries: [], selectedEntry: null };

  openAudioFileDialog = async () => {
    const file = await openFileDialog({ accept: "audio/*" });
    const data = await readFileAsArrayBuffer(file);
    const audioFile = { name: file.name, type: file.type, data };
    const id = this.props.audioLibrary.add(audioFile);
    this.setState(({ entries }) => ({
      entries: [
        ...entries,
        {
          id,
          ...audioFile
        }
      ]
    }));
  };

  previewEntry(entry: AudioEntry): void {
    this.previewAudio.src = URL.createObjectURL(new Blob([entry.data]));
    this.previewAudio.loop = true;
    this.previewAudio.play();
  }

  stopPreview = () => {
    this.previewAudio.pause();
    URL.revokeObjectURL(this.previewAudio.src);
  };

  dismiss = () => {
    this.setState({ selectedEntry: null });
    this.props.onDismiss();
  };

  selectEntry(audioEntry: AudioEntry): void {
    if (this.props.onSelect) {
      this.props.onSelect(audioEntry);
    } else {
      this.setState({ selectedEntry: audioEntry });
    }
  }

  unselectEntry = () => {
    this.setState({ selectedEntry: null });
  };

  deleteAudio = ({ id }: AudioEntry) => {
    this.props.audioLibrary.delete(id);
    this.setState(({ entries }) => ({
      entries: entries.filter(e => e.id !== id),
      selectedEntry: null
    }));
  };

  exportAudio = ({ name, type, data }: AudioEntry) => {
    saveAs(new Blob([data], { type }), name);
  };

  componentWillUnmount(): void {
    this.previewAudio.pause();
    URL.revokeObjectURL(this.previewAudio.src);
  }

  render(): React.ReactNode {
    const { entries, selectedEntry } = this.state;

    if (selectedEntry) {
      return (
        <AudioFileModal
          audioEntry={selectedEntry}
          onDelete={this.deleteAudio}
          onExport={this.exportAudio}
          onCancel={this.unselectEntry}
          onDismiss={this.dismiss}
        />
      );
    }

    return (
      <Modal title="Audio Library" onDismiss={this.dismiss}>
        <AudioList>
          {entries.length > 0 &&
            entries.map(e => (
              <AudioItem
                key={e.id}
                title={e.name}
                onClick={() => this.selectEntry(e)}
                onMouseEnter={() => this.previewEntry(e)}
                onMouseLeave={this.stopPreview}
              >
                {e.name} <br />
                {e.type} <br />
                {Math.ceil(e.data.byteLength / 1024)} KiB
              </AudioItem>
            ))}
        </AudioList>
        {!entries.length && <div>You haven't added any audio files yet</div>}
        <ActionGroup>
          <Action onClick={this.openAudioFileDialog}>Add audio file</Action>
          <Action onClick={this.dismiss}>Cancel</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
