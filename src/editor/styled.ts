import styled from "styled-components";

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
`;

export const Sidebar = styled.aside`
  width: 250px;
  height: 100%;
  background: #34495e;
  color: #fff;
  padding: 10px 15px;
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
  background: #2c3e50;
  border-radius: 3px;
  border: 2px solid #2c3e50;
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
