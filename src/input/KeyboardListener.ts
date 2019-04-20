/**
 * @author Niklas Korz
 */

// Make sure character keys are lowercased, as KeyboardEvent.key might report an uppercase
// character if the Shift-key is pressed.
const normalizeKey = (key: string): string =>
  key.length > 1 ? key : key.toLocaleLowerCase();

export default class KeyboardListener {
  target: HTMLElement;
  keysPressed = new Set<string>();
  lastKeyUp = new Map<string, number>();

  constructor(target: HTMLElement) {
    this.target = target;
  }

  listen(): void {
    this.target.addEventListener("blur", this.reset);
    this.target.addEventListener("contextmenu", this.reset);
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("click", this.onClick);
  }

  stop(): void {
    this.target.removeEventListener("blur", this.reset);
    this.target.removeEventListener("contextmenu", this.reset);
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("click", this.onClick);
    this.reset();
  }

  isPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  reset = (): void => {
    this.keysPressed.clear();
  };

  onKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault();
    const key = normalizeKey(e.key);
    // Workaround for browsers firing a queued keydown shortly after a keyup
    // Ignore keydown if the last keyup was triggered +-100ms from now
    if (Math.abs(e.timeStamp - (this.lastKeyUp.get(key) || 0)) >= 100) {
      this.keysPressed.add(key);
    }
  };

  onKeyUp = (e: KeyboardEvent): void => {
    e.preventDefault();
    const key = normalizeKey(e.key);
    this.keysPressed.delete(key);
    this.lastKeyUp.set(key, e.timeStamp);
  };

  onClick = (e: MouseEvent): void => {
    // Shift + right click forces context menu in firefox
    if (e.button === 2 && e.shiftKey) {
      this.reset();
    }
  };
}
