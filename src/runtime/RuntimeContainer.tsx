/**
 * @author Daniel Salomon
 */
import React from "react";
import Project from "../project/Project";
import Runtime from "./Runtime";

interface Props {
  project: Project;
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

  render(): React.ReactNode {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
        ref={this.targetRef}
      />
    );
  }
}
