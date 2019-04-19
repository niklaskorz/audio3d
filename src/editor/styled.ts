/**
 * @author Niklas Korz
 */
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
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

export const FocusedLabel = styled.div`
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 3px;
  background: hsl(210, 25%, 20%);
  border: 1px solid hsl(210, 15%, 40%);
  opacity: 0.8;
  color: #fff;
  pointer-events: none;
`;

export const Main = styled.main`
  position: relative;
  flex: 1;
  height: 100%;

  :focus-within > ${FocusedLabel} {
    display: block;
  }
`;

export const Sidebar = styled.aside`
  font-size: 0.9em;
  flex: 0 0 300px;
  height: 100%;
  background: hsl(210, 29%, 29%);
  color: #fff;
  padding: 0 15px;
  padding-top: 1.4em;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Group = styled.div`
  margin: 0;
  margin-bottom: 1.4em;

  & > & {
    margin-top: 1.4em;
    font-size: 0.9em;
  }
`;

export const BoldLabel = styled.label`
  font-weight: bold;
`;

export const Hint = styled.p`
  font-size: 0.9em;
  color: hsl(210, 20%, 90%);
`;

export const Input = styled.input`
  display: block;
  appearance: none;
  background: hsl(210, 29%, 24%);
  border-radius: 0.2em;
  border: 0.15em solid hsl(210, 29%, 24%);
  color: #fff;
  width: 100%;
  padding: 0.7em 0.85em;
  margin: 0.35em 0;

  transition: 0.2s ease border-color;
  :focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const Select = styled(Input.withComponent("select"))`
  cursor: pointer;
`;

export const CustomInput = styled(Input.withComponent("div"))`
  cursor: pointer;
`;

export const CodeEditor = styled(Input.withComponent("textarea"))`
  min-height: 200px;
  font-family: "Fira Code Retina", "Fira Code", Consolas, Menlo, Monaco,
    monospace;
  white-space: pre;
  line-height: 1.5;

  /* Disable user resizing of width */
  min-width: 100%;
  max-width: 100%;
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
