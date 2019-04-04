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

export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;

  > ${Input} {
    flex: 1;
    width: auto;
    min-width: 0;

    margin-right: 5px;

    :last-child {
      margin-right: 0;
    }
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
