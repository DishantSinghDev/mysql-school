import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user?: {
          role?: string;
          db_name?: string;
        } & DefaultSession["user"];
      }

    interface User extends DefaultUser {
        role: string,
        db_name: string,
    }

}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        role: string,
        db_name: string,
    }
}