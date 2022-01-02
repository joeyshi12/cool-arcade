import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Socket } from "socket.io";
import { Character, PlayerMetadata } from "../types/entityMetadata";

export function getPlayers(socket: Socket, playerService: PlayerService): () => void {
  return () => {
    socket.emit("receivePlayers", playerService.players);
  }
}

export function joinRoom(socket: Socket, playerService: PlayerService): (_: string) => void {
  return (userName: string) => {
    Log.info(`Creating player [${userName}]`);
    const randomCharacter = <Character>Object.keys(Character)[Math.floor(Math.random() * 3)];
    const player: PlayerMetadata = {
      userName: userName,
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
    const updatedPlayer = playerService.update(socket.id, player);
    socket.emit("joinedRoom", updatedPlayer);
  };
}

export function updatePlayer(socket: Socket, playerService: PlayerService): (_: PlayerMetadata) => void {
  return (metadata: PlayerMetadata) => {
    playerService.update(socket.id, metadata);
    socket.broadcast.emit("receivePlayers", playerService.players);
  };
}

export function disconnectPlayer(socket: Socket, playerService: PlayerService): () => void {
  return () => {
    const player = playerService.getPlayer(socket.id);
    if (player) {
      Log.info(`Removing player [${player.userName}]`);
      playerService.removePlayer(socket.id);
      socket.broadcast.emit("broadcastPlayers", playerService.players);
    }
  };
}
