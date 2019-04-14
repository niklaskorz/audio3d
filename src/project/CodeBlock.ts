/**
 * @author Niklas Korz
 */
export default class CodeBlock {
  source: string;
  func?: Function;

  constructor(source: string = "") {
    this.source = source;
  }

  update(source: string): void {
    this.source = source;
    this.func = undefined;
  }

  execute(playerState: any, roomState: any, thisObject: any = null): void {
    if (!this.func) {
      this.func = new Function("playerState", "roomState", this.source);
    }
    this.func.call(thisObject, playerState, roomState);
  }
}
