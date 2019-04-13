/**
 * @author Niklas Korz
 */
import React from "react";
import styled from "styled-components";
import { ProjectData } from "../data/schema";
import { getAllProjects, deleteProject } from "../data/db";
import Project from "../project/Project";
import { saveAsZip } from "../data/export";
import Modal, { ActionGroup, Action } from "./Modal";
import ProjectInfoModal from "./ProjectInfoModal";

const TableContainer = styled.div`
  border: 2px solid hsl(210, 29%, 20%);
  border-radius: 3px;
  max-height: 400px;
  min-width: 500px;
  overflow-y: auto;
  padding-bottom: 5px;
`;

const Table = styled.table`
  width: 100%;
`;

const TableHead = styled.thead`
  text-align: left;
`;

const TableRow = styled.tr`
  cursor: pointer;

  :hover {
    background: hsl(210, 29%, 40%);
  }
`;

const ColumnHead = styled.th`
  padding: 5px 10px;
`;

const ColumnData = styled.td`
  padding: 5px 10px;
`;

interface Props {
  onNewProject(): void;
  onDismiss(): void;
  onSelectProject?(data: ProjectData): void;
}

interface State {
  projects: ProjectData[];
  selectedProject: ProjectData | null;
}

export default class ProjectManagerModal extends React.Component<Props, State> {
  state: State = { projects: [], selectedProject: null };

  dismiss = () => {
    this.setState({ selectedProject: null });
    this.props.onDismiss();
  };

  selectProject(data: ProjectData): void {
    if (this.props.onSelectProject) {
      this.props.onSelectProject(data);
    } else {
      this.setState({ selectedProject: data });
    }
  }

  unselectProject = () => {
    this.setState({ selectedProject: null });
  };

  deleteProject = ({ id }: ProjectData) => {
    if (!id) {
      return;
    }
    deleteProject(id);
    this.setState(({ projects }) => ({
      projects: projects.filter(p => p.id !== id),
      selectedProject: null
    }));
  };

  exportProject = (data: ProjectData) => {
    const project = new Project().fromData(data);
    saveAsZip(project);
  };

  async componentDidMount(): Promise<void> {
    const projects = await getAllProjects();
    this.setState({ projects: projects.reverse() });
  }

  render(): React.ReactNode {
    const { projects, selectedProject } = this.state;

    if (selectedProject) {
      return (
        <ProjectInfoModal
          project={selectedProject}
          onDelete={this.deleteProject}
          onExport={this.exportProject}
          onCancel={this.unselectProject}
          onDismiss={this.dismiss}
        />
      );
    }

    return (
      <Modal
        title={this.props.onSelectProject ? "Load Project" : "Project Manager"}
        onDismiss={this.dismiss}
      >
        {projects.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <ColumnHead>ID</ColumnHead>
                  <ColumnHead>Name</ColumnHead>
                  <ColumnHead>Rooms</ColumnHead>
                  <ColumnHead>Last update</ColumnHead>
                </tr>
              </TableHead>
              <tbody>
                {projects.map(p => (
                  <TableRow key={p.id} onClick={() => this.selectProject(p)}>
                    <ColumnData>{p.id}</ColumnData>
                    <ColumnData>{p.name}</ColumnData>
                    <ColumnData>{p.rooms.length}</ColumnData>
                    <ColumnData>{p.savedAt.toLocaleString()}</ColumnData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
        {!projects.length && <p>You don't have any saved projects yet</p>}
        <ActionGroup>
          <Action onClick={this.props.onNewProject}>New project</Action>
          <Action onClick={this.dismiss}>Cancel</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
