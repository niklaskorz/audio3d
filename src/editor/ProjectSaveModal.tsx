/**
 * @author Niklas Korz
 */
import React from "react";
import Modal, { ActionGroup, Action } from "./Modal";
import { Input, Group } from "./styled";

interface Props {
  onSave(name: string): void;
  onDismiss(): void;
}

interface State {
  name: string;
}

export default class ProjectSaveModal extends React.Component<Props, State> {
  state: State = { name: "" };

  onNameChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ name: e.currentTarget.value });
  };

  submit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const { name } = this.state;
    if (name) {
      this.props.onSave(name);
    }
  };

  render(): React.ReactNode {
    const { onDismiss } = this.props;
    const { name } = this.state;

    return (
      <Modal title="Save Project" onDismiss={onDismiss}>
        <form onSubmit={this.submit}>
          <Group>
            <Input
              autoFocus
              required
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={this.onNameChange}
            />
          </Group>
          <ActionGroup>
            <Action type="submit" disabled={!name}>
              Save
            </Action>
            <Action type="button" onClick={onDismiss}>
              Cancel
            </Action>
          </ActionGroup>
        </form>
      </Modal>
    );
  }
}
