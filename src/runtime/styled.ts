/**
 * @author Daniel Salomon
 */
import styled, { css } from "styled-components";

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

export const RunningLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  border-radius: 3px;
  background: hsl(210, 25%, 20%);
  border: 1px solid hsl(210, 15%, 40%);
  opacity: 0.8;
  color: #fff;
  font-size: 25px;
`;

export const RunningHeadline = styled.p`
  color: #fff;
  font-size: 15px;
  text-align: center;
  margin: 12px 10px 5px 10px;
  font-weight: bold;
`;

export const RunningButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const RunningButton = styled.div`
  padding: 10px 15px;
  margin: 5px;
  color: #fff;
  font-size: 15px;
  border-radius: 3px;
  background: hsla(0, 0%, 100%, 0.2);
  border: 1px solid hsl(210, 15%, 40%);
  text-align: center;
  cursor: pointer;

  :hover {
    background: hsla(0, 0%, 100%, 0.4);
  }
`;

export const ControlsTable = styled.table`
  border: 0px solid transparent;
  border-collapse: collapse;
  font-size: 15px;
  width: 100%;
`;

export const Main = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  :focus-within > ${FocusedLabel} {
    display: block;
  }
`;
