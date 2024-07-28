import { Scene } from "./scene";
import Game from "../game";
import { PlayerMetadata } from "../../../../models/platformPartyModels";
import { Stage, StageMap } from "./stage";
import { Point } from "./gui";
import { Player } from "../entities/player";

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
        this._player.update(this._stage);
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

    public mouseClicked(point: Point): void {}

    public mouseMoved(point: Point): void {}
}
