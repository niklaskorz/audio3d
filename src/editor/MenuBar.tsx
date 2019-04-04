import React from "react";
import styled, { css } from "styled-components";

export const Container = styled.div`
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
}

export const MenubarItem = styled.div<MenubarItemProps>`
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
`;

export const Menu = styled.div`
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

export const MenuItem = styled.div`
  white-space: nowrap;
  padding: 8px 20px;
  margin: 2px 0;
  cursor: pointer;

  :hover {
    background: hsl(210, 29%, 15%);
  }
`;

export const MenuDivider = styled.div`
  height: 0;
  margin: 5px;
  border-bottom: 1px solid hsl(210, 15%, 35%);
`;

interface Props {
  onImportProject(): void;
  onExportProject(): void;

  onAddObject(): void;
  onAddRoom(): void;
}

enum MenuType {
  FileMenu,
  EditMenu,
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
    const { activeMenu } = this.state;

    return (
      <Container tabIndex={-1} onBlur={() => this.closeMenu()}>
        <MenubarItem
          isActive={activeMenu === MenuType.FileMenu}
          onClick={() => this.toggleMenu(MenuType.FileMenu)}
        >
          File
          <Menu hidden={activeMenu !== MenuType.FileMenu}>
            <MenuItem>New project</MenuItem>
            <MenuDivider />
            <MenuItem>Load project</MenuItem>
            <MenuItem onClick={this.props.onImportProject}>
              Import project
            </MenuItem>
            <MenuDivider />
            <MenuItem>Save project</MenuItem>
            <MenuItem onClick={this.props.onExportProject}>
              Export project
            </MenuItem>
            <MenuDivider />
            <MenuItem>Settings</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.EditMenu}
          onClick={() => this.toggleMenu(MenuType.EditMenu)}
        >
          Edit
          <Menu hidden={activeMenu !== MenuType.EditMenu}>
            <MenuItem onClick={this.props.onAddObject}>Add object</MenuItem>
            <MenuItem>Delete object</MenuItem>
            <MenuDivider />
            <MenuItem onClick={this.props.onAddRoom}>Add room</MenuItem>
            <MenuItem>Delete room</MenuItem>
            <MenuDivider />
            <MenuItem>Release the kraken</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.ViewMenu}
          onClick={() => this.toggleMenu(MenuType.ViewMenu)}
        >
          View
          <Menu hidden={activeMenu !== MenuType.ViewMenu}>
            <MenuItem>Audio Library</MenuItem>
            <MenuItem>Project Manager</MenuItem>
            <MenuDivider />
            <MenuItem>Toggle Fullscreen</MenuItem>
          </Menu>
        </MenubarItem>
        <MenubarItem
          isActive={activeMenu === MenuType.HelpMenu}
          onClick={() => this.toggleMenu(MenuType.HelpMenu)}
        >
          Help
          <Menu hidden={activeMenu !== MenuType.HelpMenu}>
            <MenuItem>Issues</MenuItem>
            <MenuItem>Source Code</MenuItem>
            <MenuDivider />
            <MenuItem>About</MenuItem>
          </Menu>
        </MenubarItem>
      </Container>
    );
  }
}
