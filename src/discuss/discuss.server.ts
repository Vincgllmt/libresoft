import { Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";
import escapeHtml from "escape-html";
import { RedisClientType, createClient } from "redis";

export class DiscussServer {
    private static io: IoServer;
    private static publishClient: RedisClientType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static create(httpServer: HttpServer, sessionMiddleware: any) {
        DiscussServer.io = new IoServer(httpServer);
        DiscussServer.io.engine.use(sessionMiddleware);
        DiscussServer.io.on('connection', DiscussServer.onClientConnection);
        DiscussServer.publishClient = createClient();
        const subscriberClient = createClient();
        subscriberClient.subscribe('info', (message, channel) => console.log(message, channel));
        subscriberClient.subscribe('message', (message, channel) => console.log(message, channel));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private static onClientConnection(socket: Socket): void {
        const contributor = socket.request.session.user.name;
        socket.on('disconnect', (reason) => {
            const info = `${contributor} a quitté la discussion`;
            console.log(info);
            DiscussServer.publishClient.publish('info', info);
        });
        socket.on('message', (message) => {
            console.log(message);
            DiscussServer.publishClient.publish('message', `[${new Date().toLocaleTimeString("fr-FR")}] ${contributor} - ${escapeHtml(message)}`);
        });
        
        const info = `${contributor} a rejoint la discussion`;
        DiscussServer.io.emit('info', info);
        console.log(info);
    }
}