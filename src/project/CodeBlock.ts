import GameObject from "./GameObject";
import Project from "./Project";

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

  execute(
    object: GameObject,
    project: Project,
    roomState: Map<string, any>
  ): void {
    try {
      if (!this.func) {
        this.func = new Function(
          "game",
          "playerState",
          "roomState",
          this.source
        );
      }
      // The first parameter is the "this" object
      this.func.call(object, project, project.playerState, roomState);
    } catch (ex) {
      console.error(
        "Execution of code block failed with error:",
        ex,
        "object:",
        object,
        "project:",
        project,
        "roomState:",
        roomState
      );
    }
  }
}
