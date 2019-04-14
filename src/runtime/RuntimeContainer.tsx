/**
 * @author Daniel Salomon
 */
import React from "react";
import Project from "../project/Project";
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

export default class RuntimeContainer extends React.Component<Props> {
  targetRef = React.createRef<HTMLDivElement>();
  runtime = new Runtime(this.props.project);

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

  render(): React.ReactNode {
    return (
      <Main ref={this.targetRef}>
        <RunningLabel>
          Audio3D
          <RunningHeadline>Menu</RunningHeadline>
          <RunningButtonContainer>
            <RunningButton onClick={this.onExit}>Exit</RunningButton>
          </RunningButtonContainer>
          <RunningHeadline>Audio implementation</RunningHeadline>
          <RunningButtonContainer>
            <RunningButton>Web</RunningButton>
            <RunningButton>Binaural</RunningButton>
            <RunningButton>Resonance</RunningButton>
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
