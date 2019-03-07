interface Element {
    requestPointerLock(): void;
}

interface Document {
    exitPointerLock(): void;
}

interface MouseEvent {
    movementX: number;
    movementY: number;
}
