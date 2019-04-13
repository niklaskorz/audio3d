/**
 * @author Niklas Korz
 */
import React from "react";
import { ProjectData } from "../data/schema";
import Modal, { ActionGroup, Action } from "./Modal";

interface Props {
  project: ProjectData;
  onDelete(project: ProjectData): void;
  onExport(project: ProjectData): void;
  onDismiss(): void;
  onCancel(): void;
}

export default class ProjectInfoModal extends React.Component<Props> {
  render(): React.ReactNode {
    const { project } = this.props;
    return (
      <Modal title="Project Info" onDismiss={this.props.onDismiss}>
        <p>
          <b>Name:</b> {project.name}
        </p>
        <p>
          <b>Last update:</b> {project.savedAt.toLocaleString()}
        </p>
        <p>
          <b>Rooms:</b> {project.rooms.length}
        </p>
        <ActionGroup>
          <Action onClick={() => this.props.onDelete(project)}>Delete</Action>
          <Action onClick={() => this.props.onExport(project)}>Export</Action>
          <Action onClick={this.props.onCancel}>Back</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
