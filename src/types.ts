import User from "./models/user";

declare module "express-session" {
    interface SessionData {
        user: User | null;
        isLoggedIn: boolean;
    }
}

declare global {
    namespace Express {
      interface Request {
        user?: User | null;
      }
    }
    interface Error {
        status?: number;
        httpStatusCode?: number;
    }
}