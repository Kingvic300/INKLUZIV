import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock user data - replace with your actual user authentication
const users = [
    {
        id: "1",
        email: "kanyinsola@gmail.com",
        name: "Kanyinsola",
        password: "password123", // In real app, use hashed passwords
    },
];

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = users.find((u) => u.email === credentials.email);

                if (user && user.password === credentials.password) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
};

// Helper type for session user
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}