export default class KeyboardListener {
  keysPressed = new Set<string>();
  lastKeyUp = new Map<string, number>();

  constructor(private target: Document = document) { }

  listen(): void {
    this.target.addEventListener("blur", this.reset);
    this.target.addEventListener("contextmenu", this.reset);
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    this.target.addEventListener("click", this.onClick);
  }

  stop(): void {
    this.target.removeEventListener("blur", this.reset);
    this.target.removeEventListener("contextmenu", this.reset);
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    this.target.removeEventListener("click", this.onClick);
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
    // Workaround for browsers firing a queued keydown shortly after a keyup
    // Ignore keydown if the last keyup was triggered +-100ms from now
    if (Math.abs(e.timeStamp - (this.lastKeyUp.get(e.key) || 0)) >= 100) {
      this.keysPressed.add(e.key);
    }
  };

  onKeyUp = (e: KeyboardEvent): void => {
    e.preventDefault();
    this.keysPressed.delete(e.key);
    this.lastKeyUp.set(e.key, e.timeStamp);
  };

  onClick = (e: MouseEvent): void => {
    // Shift + right click forces context menu in firefox
    if (e.button === 2 && e.shiftKey) {
      this.reset();
    }
  };
}
