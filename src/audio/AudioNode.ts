export default interface AudioNode {
  setBuffer(buffer: AudioBuffer): void;
  setLoop(loop: boolean): void;
  play(): void;
  stop(): void;
}
