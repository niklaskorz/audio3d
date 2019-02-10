import React from "react";
import { ResonanceAudio } from "resonance-audio";

const Context = React.createContext<ResonanceAudio | null>(null);
export default Context;

export interface SceneProps {
  scene: ResonanceAudio;
}

export const withScene = <Props extends {}>(
  Component: React.ComponentType<Props & SceneProps>
): React.ComponentType<Props> => props => (
  <Context.Consumer>
    {value => value && <Component {...props} scene={value} />}
  </Context.Consumer>
);
