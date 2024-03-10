import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(db) as any, // o as any é para forçar o tipo (não é recomendado, mas é o que está na library)
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!, // o ! indica que o valor não é nulo
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith"},
                password: { label: "Password", type: "password", placeholder: "123456" },
                name: { label: "Username", type: "text", placeholder: "john" }
            },
            async authorize(credentials) : Promise<any> {
                console.log("auth method",credentials)
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Campos faltando!");
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if(!user || !user.hashedPassword) {
                    throw new Error("Usuário não encontrado");
                }

                const matchPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

                if(!matchPassword) {
                    throw new Error("Senha incorreta");
                }

                return user
            }
            })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET!,
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/login",
    }
}

