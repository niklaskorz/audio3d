import React from "react";

export const { Provider, Consumer } = React.createContext<AudioContext | null>(
  null
);

export interface AudioContextProps {
  audioContext: AudioContext;
}

export const withAudioContext = <Props extends {}>(
  Component: React.ComponentType<Props & AudioContextProps>
): React.ComponentType<Props> => props => (
  <Consumer>
    {value => value && <Component {...props} audioContext={value} />}
  </Consumer>
);
