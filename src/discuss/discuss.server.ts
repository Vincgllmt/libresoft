import { Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";
import escapeHtml from "escape-html";

export class DiscussServer {
    private static io: IoServer;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static create(httpServer: HttpServer, sessionMiddleware: any) {
        DiscussServer.io = new IoServer(httpServer);
        DiscussServer.io.engine.use(sessionMiddleware);
        DiscussServer.io.on('connection', DiscussServer.onClientConnection);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private static onClientConnection(socket: Socket): void {
        const contributor = socket.request.session.user.name;
        socket.on('disconnect', (reason) => {
            const info = `${contributor} a quitté la discussion`;
            console.log(info);
            DiscussServer.io.emit('info', info);
        });

        socket.on('message', (message) => {
            console.log(message);
            DiscussServer.io.emit('message', `[${new Date().toLocaleTimeString("fr-FR")}] ${contributor} - ${escapeHtml(message)}`);
        });
        
        const info = `${contributor} a rejoint la discussion`;
        DiscussServer.io.emit('info', info);
        console.log(info);
    }
}