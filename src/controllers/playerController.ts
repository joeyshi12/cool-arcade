import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Socket } from "socket.io";
import { Character, PlayerMetadata } from "../types/entityMetadata";

export class PlayerController {
  constructor(private _playerService: PlayerService) {
  }

  public joinRoom(socket: Socket): () => void {
    return () => {
      Log.info(`Creating player [${socket.id}]`);
      const randomCharacter = <Character>Object.keys(Character)[Math.floor(Math.random() * 3)];
      const player: PlayerMetadata = {
        userName: socket.id,
        character: randomCharacter,
        position: {x: 100, y: 100},
        spriteIndex: 354,
        isFlipped: false,
        collisionBox: {
          width: 30,
          height: 30,
          offset: {x: 3, y: 6}
        }
      };
      const updatedPlayer = this._playerService.createOrUpdate(socket.id, player);
      socket.emit("joinedRoom", updatedPlayer);
    };
  }

  public createPlayer(req: Express.Request, res: Express.Response): void {
    try {
      console.log(req);
      // const createdPlayer = this._playerService.create(socket.id, player);
      // Log.info(`Created player ${player.userName}`);
      // socket.emit(ServerEvent.playerCreationSuccess, createdPlayer);
      // socket.broadcast.emit(ServerEvent.broadcastPlayers, this._playerService.players);
    } catch (e) {
      // const msg = e instanceof PlatformPartyError ? e.message : "Failed to create player";
      // socket.emit(ServerEvent.playerCreationFailed, msg)
    }
  }

  public updatePlayer(socket: Socket): (_: PlayerMetadata) => void {
    return (metadata: PlayerMetadata) => {
      this._playerService.createOrUpdate(socket.id, metadata);
      socket.broadcast.emit("broadcastPlayers", this._playerService.players);
    };
  }

  public disconnectPlayer(socket: Socket): () => void {
    return () => {
      Log.info(`Removing player [${socket.id}]`);
      this._playerService.removePlayer(socket.id);
      socket.broadcast.emit("broadcastPlayers", this._playerService.players);
    };
  }
}
