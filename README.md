![Logo](./public/icon.png)

# 3D Audio Evaluation Environment

[![CircleCI](https://circleci.com/gh/niklaskorz/audio3d.svg?style=svg)](https://circleci.com/gh/niklaskorz/audio3d)

An editor and test environment for experimenting with 3D audio.
Requires Node and Yarn to run locally.
You can run the [most recent online version](https://niklaskorz.github.io/audio3d/) directly from your browser. After the first load, it will also work offline (if your [browser supports service workers](https://caniuse.com/#feat=serviceworkers) and you didn't disable caching of files for offline usage in your browser settings.)

Note: Service workers are currently disabled by default until further progress is made

[Logo by Flatart](https://www.iconfinder.com/icons/4168597/3d_change_correction_modification_object_print_printing_icon)

## Based on...

- [TypeScript](https://www.typescriptlang.org/)
- [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)
- User Interface:
  - [React](https://reactjs.org/)
  - [Styled Components](https://www.styled-components.com/)
- 3D-Graphics and Scene Graph:
  - [Three.js](https://threejs.org/)
- 3D-Audio:
  - [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  - [BinauralFIR](https://github.com/Ircam-RnD/binauralFIR)
  - [Resonance Audio](https://resonance-audio.github.io/resonance-audio/)
- Desktop Standalone:
  - [NW.js](https://nwjs.io/)

## Available Scripts

First, make sure that you have both Node and Yarn installed.
Once you cloned the repository, install the project's dependencies by executing `yarn`.
Then, in the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any compiler errors in the console.

### `yarn lint`

Runs `eslint` and prints any occurring warnings or errors.

### `yarn build`

Builds the app for production to the `build` folder.<br>
The build is minified and the filenames include the hashes.

## Example sounds in this repository (`public/audio`)

- [breakbat.wav](https://github.com/Ircam-RnD/binauralFIR/blob/gh-pages/examples/snd/breakbeat.wav) by [Ircam Centre Pompidou](https://www.ircam.fr/)
- [phone.mp3](https://freesound.org/people/cs272/sounds/77723/) by [cs272](https://freesound.org/people/cs272/)
- [wind.m4a](https://freesound.org/people/Stopmotionbros/sounds/438991/) by [Stopmotionbros](https://freesound.org/people/Stopmotionbros/)
