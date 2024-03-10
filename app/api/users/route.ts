import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const data = await req.json()
    const { name, email, password } = data

    if(!name || !email || !password) {
        return NextResponse.json({message: "Campos faltando!"}, {status: 400} )
    }

    const isExistingUser = await db.user.findUnique({
        where:{
            email
        }
    })

    if(isExistingUser) return NextResponse.json({message: "Usuário já cadastrado"}, {status: 400} )

    const hashedPassword = await bcrypt.hash(password, 10)  

    const newUser = await db.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    })

    return NextResponse.json(newUser, {status: 201})
}