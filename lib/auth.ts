import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";


export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(db as any),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!, // o ! indica que o valor não é nulo
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith"},
                password: { label: "Password", type: "password" },
                name: { label: "Username", type: "text", placeholder: "john" }
            },
            async authorize(credentials) : Promise<any> {
                console.log(credentials)
                const user = { email: 'teste@gmail.com', password: '123456', name: 'teste' }
                return user
            }
            })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET!,
    debug: process.env.NODE_ENV === "development",
}

