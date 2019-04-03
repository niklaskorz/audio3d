import styled, { css } from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
`;

export const Menu = styled.div`
  display: none;
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
`;

export const MenuItem = styled.div`
  white-space: nowrap;
  padding: 8px 20px;
  margin: 2px 0;

  :hover {
    background: hsl(210, 25%, 30%);
  }
`;

export const MenuDivider = styled.div`
  height: 0;
  margin: 5px;
  border-bottom: 1px solid hsl(210, 15%, 35%);
`;

export const Menubar = styled.div`
  flex: 0 0 auto;
  background: hsl(210, 29%, 15%);
  color: #fff;
  font-size: 0.9em;
  padding: 0 10px;
`;

export const MenubarItem = styled.div`
  position: relative;
  display: inline-block;
  padding: 10px 15px;
  cursor: pointer;

  :hover,
  :focus {
    background: hsl(210, 29%, 20%);
  }

  :focus > ${Menu} {
    display: block;
  }
`;

MenubarItem.defaultProps = {
  tabIndex: -1
};

export const InnerContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const Sidebar = styled.aside`
  flex: 0 0 300px;
  height: 100%;
  background: hsl(210, 29%, 29%);
  color: #fff;
  padding: 0 15px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Main = styled.main`
  flex: 1;
  height: 100%;
`;

export const Group = styled.div`
  margin: 20px 0;
`;

export const Input = styled.input`
  display: block;
  appearance: none;
  background: hsl(210, 29%, 24%);
  border-radius: 3px;
  border: 2px solid hsl(210, 29%, 24%);
  color: #fff;
  width: 100%;
  padding: 10px 12px;
  margin: 5px 0;

  transition: 0.2s ease border-color;
  :focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const RoomList = styled.ol`
  list-style: none;
  padding: 5px;
  margin: 5px 0;
  border-radius: 3px;
  background: hsl(210, 29%, 24%);
`;

interface RoomListItemProps {
  active?: boolean;
}

export const RoomListItem = styled.li<RoomListItemProps>`
  cursor: pointer;
  padding: 7px 10px;
  border-radius: 2px;
  ${props =>
    props.active &&
    css`
      background: hsl(210, 29%, 20%);
      border-left: 2px solid #3498db;
    `};
`;
