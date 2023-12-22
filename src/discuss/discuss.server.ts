import { Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";
import escapeHtml from "escape-html";
import { RedisClientType, createClient } from "redis";
import { redis } from "../services/redis";

export class DiscussServer {
    private static io: IoServer;
    private static publishClient: RedisClientType
    private static subscribeClient: RedisClientType

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static create(httpServer: HttpServer, sessionMiddleware: any) {
        DiscussServer.io = new IoServer(httpServer);
        DiscussServer.io.engine.use(sessionMiddleware);
        DiscussServer.io.on('connection', DiscussServer.onClientConnection);
        DiscussServer.publishClient = createClient();
        DiscussServer.subscribeClient = createClient();

        DiscussServer.publishClient.connect()
        .then(() => {
            console.log("Redis publish client connected");
        });
        DiscussServer.subscribeClient.connect().then(() => {
            DiscussServer.subscribeClient.subscribe('info', (message, channel) => console.log(message, channel));
            DiscussServer.subscribeClient.subscribe('message', (message, channel) => console.log(message, channel));
            console.log("Redis subscribe client connected");
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private static async onClientConnection(socket: Socket) {
        const user = socket.request.session.user;
        const contributor = user.name;

        const sendUsers = async () => {
            const users = await redis.hGetAll("discuss:connected");
            socket.emit('users', Object.values(users).map(x => {
                const userCacheData = JSON.parse(x);
                return {
                    id: userCacheData._id,
                    name: userCacheData.name,
                }
            }));
        }
        
        await redis.hSet("discuss:connected", String(socket.request.session.user._id), JSON.stringify({
            _id: socket.request.session.user._id,
            name: socket.request.session.user.name,
        }));
        
        await sendUsers();

        socket.on('disconnect', async (reason) => {
            const info = `${contributor} a quitté la discussion`;
            console.log(info);
            socket.broadcast.emit('info', info);
            await sendUsers();
            DiscussServer.publishClient.publish('info', info);
            redis.hDel("discuss:connected", socket.request.session.user._id);
        });
        socket.on('message', (message) => {
            console.log(message);
            const data_message: string = `[${new Date().toLocaleTimeString("fr-FR")}] ${contributor} - ${escapeHtml(message)}`;
            const data = {
                contributor_id: socket.request.session.user._id,
                message: data_message,
                date: new Date().toLocaleTimeString("fr-FR")
            }
            socket.broadcast.emit('message', data);
            socket.emit('message', data);
            DiscussServer.publishClient.publish('message', JSON.stringify(data));
        });
        
        const info = `${contributor} a rejoint la discussion`;
        DiscussServer.io.emit('info', info);
        console.log(info);
    }

    static async sendAvatarUpdate(contributor_id: string) {
        if(await redis.hExists("discuss:connected", contributor_id)){
            DiscussServer.io.emit('avatarupdate', {id: contributor_id});
        }
    }
}