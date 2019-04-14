/**
 * @author Niklas Korz
 */

const AXIS_THRESHOLD = 0.15; //Inaccuracy of gamepads (tested XBOX One S gamepad up to 0.11 - Daniel)

export default class GamepadListener {
  listen(): void {
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
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
      if (!gamepad || gamepad.mapping !== "standard") {
        continue;
      }

      if (index < 4) {
        const axis = gamepad.axes[index];
        if (
          Math.abs(axis) >= AXIS_THRESHOLD &&
          Math.abs(axis) > Math.abs(value)
        ) {
          value = axis;
        }
      } else if (index === 4) {
        const v1 = gamepad.buttons[6].value;
        const v2 = gamepad.buttons[7].value;
        const axis = v2 - v1;
        if (Math.abs(axis) > Math.abs(value)) {
          value = axis;
        }
      }
    }
    return value;
  }
}
