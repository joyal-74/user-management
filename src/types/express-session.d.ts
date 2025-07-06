import 'express-session';

declare module 'express-session' {
    interface SessionData {
        student?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }
}
