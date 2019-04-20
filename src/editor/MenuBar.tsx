/**
 * @author Niklas Korz
 */
import React from "react";
import styled, { css } from "styled-components";
import AudioImplementation from "../audio/AudioImplementation";

const Container = styled.div`
  flex: 0 0 auto;
  background: hsl(210, 29%, 15%);
  color: #fff;
  font-size: 0.9em;
  padding: 0 10px;
  user-select: none;

  :focus {
    outline: none;
  }
`;

interface MenubarItemProps {
  isActive?: boolean;
  alignRight?: boolean;
}

const MenubarItem = styled.div<MenubarItemProps>`
  position: relative;
  display: inline-block;
  padding: 10px 15px;
  cursor: pointer;

  :hover {
    background: hsl(210, 25%, 20%);
  }

  ${props =>
    props.isActive &&
    css`
      background: hsl(210, 25%, 20%);
    `}

  ${props =>
    props.alignRight &&
    css`
      float: right;
    `}
`;

const MenubarItemLabel = styled.label`
  cursor: pointer;
`;

const Menu = styled.div`
  z-index: 1;
  position: absolute;
  left: 0;
  top: 100%;
  background: hsl(210, 25%, 20%);
  padding: 5px 0;
  min-width: 200px;
  font-size: 0.95em;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.5);

  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;

  cursor: default;
`;

const MenuItem = styled.div`
  white-space: nowrap;
  padding: 8px 20px;
  margin: 2px 0;
  cursor: pointer;

  :hover {
    background: hsl(210, 29%, 15%);
  }
`;

const MenuDivider = styled.div`
  height: 0;
  margin: 5px;
  border-bottom: 1px solid hsl(210, 15%, 35%);
`;

interface Props {
  audioImplementation: AudioImplementation;

  onNewProject(): void;
  onLoadProject(): void;
  onSaveProject(): void;
  onImportProject(): void;
  onExportProject(): void;
  onShowSettings(): void;

  onAddObject(): void;
  onDeleteObject(): void;
  onAddSpawn(): void;
  onDeleteSpawn(): void;
  onAddRoom(): void;
  onDeleteRoom(): void;

  onShowAudioLibrary(): void;
  onShowProjectManager(): void;

  onAudioChange(audioImplementation: AudioImplementation): void;
  onRunProject(): void;
}

enum MenuType {
  FileMenu,
  EditMenu,
  AudioMenu,
  ViewMenu,
  HelpMenu
}

interface State {
  activeMenu: MenuType | null;
}

export default class MenuBar extends React.Component<Props, State> {
  state: State = {
    activeMenu: null
  };

  toggleMenu(menuType: MenuType): void {
    this.setState(state => ({
      activeMenu: state.activeMenu === menuType ? null : menuType
    }));
  }

  closeMenu(): void {
    this.setState({ activeMenu: null });
  }

  render(): React.ReactNode {
    const { audioImplementation, onAudioChange } = this.props;
    const { activeMenu } = this.state;

    return (
      <Container tabIndex={-1} onBlur={() => this.closeMenu()}>
        <MenubarItem
          isActive={activeMenu === MenuType.FileMenu}
          onClick={() => this.toggleMenu(MenuType.FileMenu)}
        >
          <MenubarItemLabel>File</MenubarItemLabel>
          <Menu hidden={activeMenu !== MenuType.FileMenu}>
            <MenuItem onClick={this.props.onNewProject}>New project</MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onLoadProject}>Load project</MenuItem>
            <MenuItem onClick={this.props.onImportProject}>
              Import project
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onSaveProject}>Save project</MenuItem>
            <MenuItem onClick={this.props.onExportProject}>
              Export project
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onShowSettings}>Settings</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.EditMenu}
          onClick={() => this.toggleMenu(MenuType.EditMenu)}
        >
          <MenubarItemLabel>Edit</MenubarItemLabel>
          <Menu hidden={activeMenu !== MenuType.EditMenu}>
            <MenuItem onClick={this.props.onAddObject}>Add object</MenuItem>
            <MenuItem onClick={this.props.onDeleteObject}>
              Delete object
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onAddSpawn}>Add spawn</MenuItem>
            <MenuItem onClick={this.props.onDeleteSpawn}>Delete spawn</MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onAddRoom}>Add room</MenuItem>
            <MenuItem onClick={this.props.onDeleteRoom}>Delete room</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.ViewMenu}
          onClick={() => this.toggleMenu(MenuType.ViewMenu)}
        >
          <MenubarItemLabel>View</MenubarItemLabel>
          <Menu hidden={activeMenu !== MenuType.ViewMenu}>
            <MenuItem onClick={this.props.onShowAudioLibrary}>
              Audio Library
            </MenuItem>
            <MenuItem onClick={this.props.onShowProjectManager}>
              Project Manager
            </MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.HelpMenu}
          onClick={() => this.toggleMenu(MenuType.HelpMenu)}
        >
          <MenubarItemLabel>Help</MenubarItemLabel>
          <Menu hidden={activeMenu !== MenuType.HelpMenu}>
            <MenuItem
              onClick={() =>
                window.open(
                  "https://github.com/niklaskorz/audio3d/wiki/Code-Blocks",
                  "_blank"
                )
              }
            >
              How to use Code Blocks
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() =>
                window.open(
                  "https://github.com/niklaskorz/audio3d/issues",
                  "_blank"
                )
              }
            >
              Issues
            </MenuItem>
            <MenuItem
              onClick={() =>
                window.open("https://github.com/niklaskorz/audio3d", "_blank")
              }
            >
              Source Code
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() =>
                window.open(
                  "https://github.com/niklaskorz/audio3d/blob/master/README.md",
                  "_blank"
                )
              }
            >
              About
            </MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem alignRight onClick={this.props.onRunProject}>
          <MenubarItemLabel>Run</MenubarItemLabel>
        </MenubarItem>
        <MenubarItem
          alignRight
          isActive={activeMenu === MenuType.AudioMenu}
          onClick={() => this.toggleMenu(MenuType.AudioMenu)}
        >
          <MenubarItemLabel>Audio: {audioImplementation}</MenubarItemLabel>
          <Menu hidden={activeMenu !== MenuType.AudioMenu}>
            <MenuItem
              onClick={() => onAudioChange(AudioImplementation.WebAudio)}
            >
              {AudioImplementation.WebAudio}
            </MenuItem>
            <MenuItem
              onClick={() => onAudioChange(AudioImplementation.Binaural)}
            >
              {AudioImplementation.Binaural}
            </MenuItem>

            <MenuItem
              onClick={() => onAudioChange(AudioImplementation.ResonanceAudio)}
            >
              {AudioImplementation.ResonanceAudio}
            </MenuItem>
          </Menu>
        </MenubarItem>
      </Container>
    );
  }
}
