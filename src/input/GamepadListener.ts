const AXIS_THRESHOLD = 0.1;

export default class GamepadListener {
  listen(): void {
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    (window as any).g = this;
  }

  stop(): void {
    window.removeEventListener("gamepadconnected", this.onGamepadConnected);
    window.removeEventListener(
      "gamepaddisconnected",
      this.onGamepadDisconnected
    );
  }

  onGamepadConnected = (e: GamepadEvent) => {
    console.log("Gamepad connected:", e.gamepad);
  };

  onGamepadDisconnected = (e: GamepadEvent) => {
    console.log("Gamepad disconnected:", e.gamepad);
  };

  getAxis(index: number): number {
    const gamepads = navigator.getGamepads();

    let value = 0;
    for (const gamepad of gamepads) {
      if (
        gamepad !== null &&
        gamepad.mapping === "standard" &&
        gamepad.axes.length > index &&
        Math.abs(gamepad.axes[index]) >= AXIS_THRESHOLD &&
        Math.abs(gamepad.axes[index]) > Math.abs(value)
      ) {
        value = gamepad.axes[index];
      }
    }
    return value;
  }
}
