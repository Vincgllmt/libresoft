import { Contributor } from "../auth/auth";
import { User } from "../models/user";

declare module "express-session" {
    interface SessionData {
        user: Contributor
    }
}
