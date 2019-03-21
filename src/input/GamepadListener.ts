export default class GamepadListener {
  constructor() {}

  listen(): void {
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
  }

  stop(): void {
    window.removeEventListener("gamepadconnected", this.onGamepadConnected);
  }

  onGamepadConnected = (e: GamepadEvent) => {
    console.log("Gamepad connected:", e.gamepad);
  };
}
