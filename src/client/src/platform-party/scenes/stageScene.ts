import { Scene } from "./scene";
import Game from "../game";
import { PlayerMetadata, PlayerState } from "../../../../models/platformPartyModels";
import { CollisionEvents, Stage, StageMap, TileType } from "./stage";
import { FRICTION, GRAVITY, MAX_SPEED, Player } from "../entities/player";

const SPRITE_LENGTH = 16;

export default class StageScene extends Scene {
    private readonly _stage: Stage;
    private _playerMetadata: PlayerMetadata[] = [];

    public constructor(game: Game, stageMap: StageMap, private _player: Player) {
        super(game);
        this._stage = new Stage(stageMap);
        this.game.socket.on("receivePlayer", (updatedPlayer: PlayerMetadata) => {
            const playerIndex = this._playerMetadata.findIndex(p => p.name === updatedPlayer.name);
            if (playerIndex === -1) {
                this._playerMetadata.push(updatedPlayer);
            } else {
                this._playerMetadata[playerIndex] = updatedPlayer;
            }
        });
    }

    public keyPressed(event: KeyboardEvent) {
        this._player.keyPressed(event.key);
    }

    public keyReleased(event: KeyboardEvent) {
        this._player.keyReleased(event.key);
    }

    public update() {
        this._updatePlayer();
        if (this._player.isMoving) {
            this.game.socket.emit("updatePlayer", this._player.metadata);
        }
        this.game.renderer.updateCameraPosition(this._player.metadata.position, this._stage);
        this.game.renderer.drawStage(this._stage);
        for (const player of this._playerMetadata) {
            if (player.name !== this._player.metadata.name) {
                this.game.renderer.drawPlayer(player);
            }
        }
        this.game.renderer.drawPlayer(this._player.metadata);
    }

    private _updatePlayer() {
        const metadata = this._player.metadata;
        if (metadata.position.y > this._stage.mapData.rows * SPRITE_LENGTH) {
            this._player.reset();
            return;
        }

        const row = Math.floor((metadata.position.y + metadata.collisionBox.offset.y + metadata.collisionBox.height / 2) / SPRITE_LENGTH);
        const col = Math.floor((metadata.position.x + metadata.collisionBox.offset.x + metadata.collisionBox.width / 2) / SPRITE_LENGTH);
        if (this._stage.getSprite(row, col) === 22) {
            this._player.state = PlayerState.DEAD;
            setTimeout(() => this._player.reset(), 2000);
        }

        this._player.update();
        const collisions: CollisionEvents = stage.getCollisionEvents(metadata);

        if (collisions.left?.tileType === TileType.SOLID && this._player.velocity.x < 0) {
            metadata.position.x = collisions.left.x!;
            this._player.velocity.x = 0;
        } else if (collisions.right?.tileType === TileType.SOLID && this._player.velocity.x > 0) {
            metadata.position.x = collisions.right.x!;
            this._player.velocity.x = 0;
        } else {
            if (this._player.acceleration.x === 0) {
                if (Math.abs(this._player.velocity.x) < FRICTION) {
                    this._player.velocity.x = 0;
                } else {
                    this._player.velocity.x = this._player.velocity.x > 0
                        ? this._player.velocity.x - FRICTION
                        : this._player.velocity.x + FRICTION;
                }
            }
            if (this._player.velocity.x >= MAX_SPEED) {
                this._player.velocity.x = MAX_SPEED;
            } else if (this._player.velocity.x <= -MAX_SPEED) {
                this._player.velocity.x = -MAX_SPEED;
            }
        }

        if (collisions.bottom?.tileType === TileType.SOLID && this._player.velocity.y >= 0) {
            metadata.position.y = collisions.bottom.y!;
            this._player.acceleration.y = 0;
            if (this._player.state === PlayerState.FALLING) {
                this._player.state = PlayerState.STANDING;
                this.game.getSound("land").play();
            }
            if (this._player.velocity.x === 0) {
                if (this._player.state !== PlayerState.STANDING) {
                    this._player.state = PlayerState.STANDING;
                }
            } else {
                if (this._player.state === PlayerState.STANDING) {
                    this._player.state = PlayerState.WALKING;
                } else if (this._player.state === PlayerState.WALKING) {
                    this._player.tickAnimation();
                }
            }
        } else {
            this._player.acceleration.y = GRAVITY;
            this._player.state = PlayerState.FALLING;
        }

        this._player.updateSprite();

        if (collisions.top?.tileType === TileType.SOLID) {
            metadata.position.y = collisions.top.y!;
            this._player.velocity.y = 0;
        } else {
            const isGrounded = this._player.state === PlayerState.STANDING || this._player.state === PlayerState.WALKING;
            this._player.velocity.y = isGrounded ? 0 : this._player.velocity.y + this._player.acceleration.y;
        }

        if (this._player.velocity.x > 0) {
            metadata.isFlipped = false;
        } else if (this._player.velocity.x < 0) {
            metadata.isFlipped = true;
        }
    }
}
