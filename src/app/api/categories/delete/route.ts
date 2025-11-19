import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Category id is required" }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id: Number(id) }
        })

        return NextResponse.json({ message: "Category deleted successfully" });

    } catch (error: unknown) {
        console.error(error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Category deletion error" }, { status: 500 });
    }
}

