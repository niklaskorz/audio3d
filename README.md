# 3D Audio Evaluation Environment

An editor and test environment for experimenting with 3D audio.
Requires Node and Yarn to run locally.
You can run the [most recent online version](https://niklaskorz.github.io/audio3d/) directly from your browser. After the first load, it will also work offline (if your [browser supports service workers](https://caniuse.com/#feat=serviceworkers) and you didn't disable caching of files for offline usage in your browser settings.)

Note: Service workers are currently disabled by default until further progress is made

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any compiler errors in the console.

### `yarn lint`

Runs tslint and prints any occurring warnings or errors.

### `yarn build`

Builds the app for production to the `build` folder.<br>
The build is minified and the filenames include the hashes.
