import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            /** The user's unique id. */
            id: string;
        } & DefaultSession["user"];
    }
}
