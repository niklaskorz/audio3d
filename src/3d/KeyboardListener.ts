export default class KeyboardListener {
  keysPressed = new Set<string>();

  constructor(private target: Document = document) {}

  listen(): void {
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
  }

  stop(): void {
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
  }

  isPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  onKeyDown = (e: KeyboardEvent): void => {
    e.preventDefault();
    this.keysPressed.add(e.key);
  };

  onKeyUp = (e: KeyboardEvent): void => {
    e.preventDefault();
    this.keysPressed.delete(e.key);
  };
}
