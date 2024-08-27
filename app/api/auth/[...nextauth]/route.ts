import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createDatabase, createUser, fetchUserCredentials } from "../../db-modal/db";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        pin: {label: "Pin", type: "password"}
      },
      async authorize(credentials: Record<"email" | "password" | "pin", string> | undefined, req: any) {
        if (!credentials) {
          return null; // Handle the case where no credentials are provided
        }

        const { email, password, pin } = credentials;
        console.log("pin",pin)

        try {
          const user = await fetchUserCredentials(email);
          console.log("User:", user);

          if (!user) {
            console.error("No user found for the provided email.");
            return null;
          }

          if (user && user.password === password && user.pin === pin) {
            try {
              const res = await createDatabase(user.db_name);
              if (!res) {
                return null;
              }
              try {
                const res2 = await createUser(user.username, user.password, user.db_name);
                if (!res2) {
                  return null;
                }
              } catch (error) {
                console.error("Error creating user:", error);
                return null;
              }
            } catch (error) {
              console.error("Error creating database:", error);
              return null;
            }

            return {
              id: user.id,
              name: user.username,
              email: user.email,
              db_name: user.db_name,
              role: user.role || "user" // Ensure role is set, default to "user" if not present
            };
          }
          // Ensure db_name is included

        } catch (error: any) {
          console.error("Error during authorization:", error.message, error.stack);
          return null;
        }

        return null; // Return null if authentication fails
      }

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.db_name = user.db_name; // Add db_name to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.db_name = token.db_name; // Add db_name to the session user
      }
      return session;
    }
  }
};


const headers = NextAuth(authOptions);

export { headers as GET, headers as POST };