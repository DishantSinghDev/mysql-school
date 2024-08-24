import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail} from "../model/managementdb"
import { getStudentByEmail } from "../model/studentdb";

const authOptions:  NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials: Record<"email" | "password" | "role", string> | undefined, req: any) {
        if (!credentials) {
          return null; // Handle the case where no credentials are provided
        }

      
        const { email, password, role } = credentials;
        console.log("role", role);
        if (role === "student") {
          const stu = await getStudentByEmail(email);
        
        
          if (stu && password === stu.pass) {
            return {
              ...stu, // Spread all properties from stu
              id: stu.admno, // This will override the id if it exists in stu
              name: stu.fname + " " + stu.lname, // Combine first and last name
              email: stu.email, // Ensure the email from credentials is used
              image: `https://sps.dishantsingh.me/api/api/proxyforimg?admno=${stu.admno}`, // Custom image URL
              role: stu.role || "user" // Ensure role is set, default to "user" if not present
            };
          }
        } else if (role === "manager") {
          const user = await getUserByEmail(email);
        
          if (user && password === user.pass) {
            return {
              id: user._id,
              email: user.email,
              role: user.role || "user"
            };
          }
          
        }
      
        return null; // Return null if authentication fails
      }
      
    }),
  ],
  pages: {
    signIn: "/signin/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role
      return session
    }
  }
};

export default NextAuth(authOptions);