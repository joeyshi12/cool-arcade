import { Character, PlayerMetadata, PlayerState, Vector } from "../../../../models/platformPartyModels";
import { Sound } from "../sound";

export const ACCELERATION = 1;
export const GRAVITY = 0.3;
export const MAX_SPEED = 3;
export const JUMP_VELOCITY = 6;
export const FRICTION = 0.4;
export const ANIMATION_BUFFER = 6;

export class Player {
    public velocity: Vector = {x: 0, y: 0};
    public acceleration: Vector = {x: 0, y: 0};
    public state: PlayerState;
    private _stateIndex: number;
    private _animationTimer: number;
    private _animationStates: Map<PlayerState, number[]>

    constructor(private _metadata: PlayerMetadata,
                private _jumpSound: Sound) {
        this._animationStates = buildAnimationStates(_metadata.character);
    }

    public get metadata(): PlayerMetadata {
        return this._metadata;
    }

    public keyPressed(key: string): void {
        switch (key.toLocaleUpperCase()) {
            case "W":
                if (this.state === PlayerState.WALKING || this.state === PlayerState.STANDING) {
                    this._jumpSound.play();
                    this._metadata.position.y--;
                    this.velocity.y = -JUMP_VELOCITY;
                    this.state = PlayerState.FALLING;
                }
                return;
            case "A":
                this.acceleration.x = -ACCELERATION;
                return;
            case "D":
                this.acceleration.x = ACCELERATION;
                break;
            default:
        }
    }

    public keyReleased(key: string): void {
        switch (key.toLocaleUpperCase()) {
            case "A":
                if (this.acceleration.x < 0) {
                    this.acceleration.x = 0;
                }
                break;
            case "D":
                if (this.acceleration.x > 0) {
                    this.acceleration.x = 0;
                }
                break;
            default:
        }
    }

    public get isMoving(): boolean {
        return this.velocity.x !== 0 || this.velocity.y !== 0;
    }

    public update(): void {
        this._metadata.position.x += this.velocity.x;
        this._metadata.position.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
    }

    public tickAnimation(): void {
        if (this._animationTimer <= 0) {
            this._stateIndex = (this._stateIndex + 1) % (this._animationStates.get(this.state)?.length ?? 0);
            this._animationTimer = ANIMATION_BUFFER;
        } else {
            this._animationTimer--;
        }
    }

    public updateSprite(): void {
        this._metadata.spriteIndex = this._animationStates.get(this.state)?.[this._stateIndex] || 0;
    }

    public reset(): void {
        this._metadata.position.x = 120;
        this._metadata.position.y = 200;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.state = PlayerState.FALLING;
        this._metadata.isFlipped = false;
    }
}

function buildAnimationStates(character: Character): Map<PlayerState, number[]> {
    switch (character) {
        case Character.ORANGE:
            return new Map([
                [PlayerState.STANDING, [402]],
                [PlayerState.WALKING, [402, 403, 404, 405]],
                [PlayerState.FALLING, [406]],
                [PlayerState.DEAD, [407]]
            ]);
        case Character.GREEN:
            return new Map([
                [PlayerState.STANDING, [450]],
                [PlayerState.WALKING, [450, 451, 452, 453]],
                [PlayerState.FALLING, [454]],
                [PlayerState.DEAD, [455]]
            ]);
        default: // blue
            return new Map([
                [PlayerState.STANDING, [354]],
                [PlayerState.WALKING, [354, 355, 356, 357]],
                [PlayerState.FALLING, [358]],
                [PlayerState.DEAD, [359]]
            ]);
    }
}
