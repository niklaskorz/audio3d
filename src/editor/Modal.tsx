/**
 * @author Niklas Korz
 */
import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  border-radius: 5px;
  overflow: hidden;
  max-width: 600px;
  color: #fff;
  background: hsl(210, 29%, 29%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const TitleBar = styled.div`
  padding: 10px 15px;
  background: hsl(210, 29%, 15%);
`;

const Content = styled.div`
  padding: 10px 15px;
`;

export const ActionGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const Action = styled.button`
  display: block;
  appearance: none;
  border: none;
  background: hsl(210, 29%, 20%);
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  padding: 8px 12px;
  margin-left: 10px;
  font-size: 0.9em;

  transition: 0.2s background-color, 0.2s box-shadow;

  :hover,
  :active {
    background: hsl(210, 29%, 35%);
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  }

  :focus {
    outline: none;
    border-color: #3498db;
  }

  :disabled {
    background: hsl(210, 19%, 20%);
    color: hsl(210, 20%, 80%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface Props {
  title: string;
  onDismiss?(): void;
}

export default class Modal extends React.Component<Props> {
  onBackdropClick: React.MouseEventHandler = e => {
    if (e.currentTarget === e.target && this.props.onDismiss) {
      this.props.onDismiss();
    }
  };

  render(): React.ReactNode {
    return (
      <Backdrop onClick={this.onBackdropClick}>
        <Container>
          <TitleBar>{this.props.title}</TitleBar>
          <Content>{this.props.children}</Content>
        </Container>
      </Backdrop>
    );
  }
}
