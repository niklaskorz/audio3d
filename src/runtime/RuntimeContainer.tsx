/**
 * @author Daniel Salomon
 */
import React from "react";
import Project from "../project/Project";
import AudioImplementation from "../audio/AudioImplementation";
import Runtime from "./Runtime";
import {
  Main,
  FocusedLabel,
  RunningLabel,
  RunningHeadline,
  RunningButton,
  RunningButtonContainer,
  ControlsTable
} from "./styled";

interface Props {
  project: Project;
  onExit(): void;
}
interface State {
  audioImplementation: AudioImplementation;
}

export default class RuntimeContainer extends React.Component<Props> {
  targetRef = React.createRef<HTMLDivElement>();
  runtime = new Runtime(this.props.project);
  activeButtonRef: HTMLElement | null = null;

  state: State = { audioImplementation: AudioImplementation.WebAudio };

  constructor(props: Props) {
    super(props);
    this.state.audioImplementation = this.props.project.activeAudioImplementation;
  }

  componentDidMount(): void {
    if (this.targetRef.current) {
      this.runtime.attach(this.targetRef.current);
      this.runtime.focus();
    }
  }

  componentWillUnmount(): void {
    this.runtime.detach();
  }

  onExit = () => {
    this.runtime.detach();
    this.props.onExit();
  };

  onVisualToggle = () => {
    this.runtime.toggleRendering();
  };

  onChangeAudio = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    audio: AudioImplementation
  ) => {
    this.props.project.selectAudioImplementation(audio);
    this.setState({ audioImplementation: audio });
  };

  render(): React.ReactNode {
    const { audioImplementation } = this.state;

    return (
      <Main ref={this.targetRef}>
        <RunningLabel>
          Audio3D
          <RunningHeadline>Menu</RunningHeadline>
          <RunningButtonContainer>
            <RunningButton onClick={this.onExit}>Exit</RunningButton>
            <RunningButton onClick={this.onVisualToggle}>
              Toggle visuals
            </RunningButton>
          </RunningButtonContainer>
          <RunningHeadline>Audio implementation</RunningHeadline>
          <RunningButtonContainer>
            <RunningButton
              onClick={e => this.onChangeAudio(e, AudioImplementation.WebAudio)}
              selected={audioImplementation === AudioImplementation.WebAudio}
            >
              Web Audio API
            </RunningButton>
            <RunningButton
              selected={audioImplementation === AudioImplementation.Binaural}
              onClick={e => this.onChangeAudio(e, AudioImplementation.Binaural)}
            >
              BinauralFIR
            </RunningButton>
            <RunningButton
              selected={
                audioImplementation === AudioImplementation.ResonanceAudio
              }
              onClick={e =>
                this.onChangeAudio(e, AudioImplementation.ResonanceAudio)
              }
            >
              Resonance Audio
            </RunningButton>
          </RunningButtonContainer>
          <RunningHeadline>Controls</RunningHeadline>
          <ControlsTable>
            <tr>
              <td>Move</td>
              <td>W/A/S/D or left stick</td>
            </tr>
            <tr>
              <td>View</td>
              <td>Arrow keys or right stick</td>
            </tr>
            <tr>
              <td>Interact</td>
              <td>E or A (XBOX)</td>
            </tr>
          </ControlsTable>
        </RunningLabel>
        <FocusedLabel>Focused</FocusedLabel>
      </Main>
    );
  }
}
