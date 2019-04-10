import React from "react";
import styled from "styled-components";
import { ProjectData } from "../data/schema";
import { getAllProjects } from "../data/db";
import Modal, { ActionGroup, Action } from "./Modal";

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
  onSelectProject(data: ProjectData): void;
  onNewProject(): void;
  onDismiss(): void;
}

interface State {
  projects: ProjectData[];
}

export default class ProjectManagerModal extends React.Component<Props, State> {
  state: State = { projects: [] };

  selectProject(data: ProjectData): void {
    this.props.onSelectProject(data);
  }

  async componentDidMount(): Promise<void> {
    const projects = await getAllProjects();
    this.setState({ projects: projects.reverse() });
  }

  render(): React.ReactNode {
    const { onDismiss } = this.props;
    const { projects } = this.state;

    return (
      <Modal title="Projects" onDismiss={onDismiss}>
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
        <ActionGroup>
          <Action onClick={onDismiss}>New project</Action>
          <Action onClick={onDismiss}>Cancel</Action>
        </ActionGroup>
      </Modal>
    );
  }
}
