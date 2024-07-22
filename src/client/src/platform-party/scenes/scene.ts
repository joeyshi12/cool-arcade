import Game from "../game";
import { Point } from "./gui";

export abstract class Scene {
    protected constructor(protected game: Game) {}

    public mouseClicked(point: Point): void {
        // Do nothing by default
    }

    public mouseMoved(point: Point): void {
        // Do nothing by default
    }

    public keyPressed(event: KeyboardEvent): void {
        // Do nothing by default
    }

    public keyReleased(event: KeyboardEvent): void {
        // Do nothing by default
    }

    public abstract update(): void
}
