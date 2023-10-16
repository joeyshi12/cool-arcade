import * as path from "path";
import {createServer} from "http";
import * as express from "express";
import {Server, Socket} from "socket.io";
import Log from "./util/logger";
import { SnakeController } from "./controllers/snakeController";
import { PlatformPartyController } from "./controllers/platformPartyController";
import { Request, Response } from "express";

const app = express();
const httpServer = createServer(app);
const port = process.env["PORT"] || 8080;
const io = new Server(httpServer, {path: "/platform-party/socket.io"});

const snakeController = new SnakeController();
const platformPartyController = new PlatformPartyController();

app.use(express.static(path.join(__dirname, "web")));
app.get("/snake/scores", (req: Request, res: Response) => snakeController.getAllScores(req, res));
app.put("/snake/scores", (req: Request, res: Response) => snakeController.submitScore(req, res));
app.get("/platform-party/maps", (req: Request, res: Response) => platformPartyController.getAllMaps(req, res));
app.put("/platform-party/maps", (req: Request, res: Response) => platformPartyController.uploadMap(req, res));
app.use((_: Request, res: Response) => {
    res.status(404);
    res.sendFile(path.join(__dirname, "web", "404.html"));
});

io.on("connection", (socket: Socket) => {
    socket.on("login", platformPartyController.createPlayer(socket).bind(this));
    socket.on("updatePlayer", platformPartyController.updatePlayer(socket).bind(this));
    socket.on("disconnect", platformPartyController.deletePlayer(socket).bind(this));
});

httpServer.listen(port, () => {
    Log.info(`Listening on port ${port}`);
});
