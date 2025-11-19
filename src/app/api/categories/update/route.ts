import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { id, name, description } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "No such category id" }, { status: 400 });
        }

        const updateCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
            }
        })

        return NextResponse.json(updateCategory);

    } catch (error: unknown) {
        console.error(error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category with this name already exists.' },
                { status: 400 }
            )
        }

        return NextResponse.json({ error: "Category update error" }, { status: 500 });
    }
}

