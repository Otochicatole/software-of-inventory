import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { id, name, description, price, stock, categoryIds } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "No such product id" }, { status: 400 });
        }

        // If categoryIds is provided, update the categories relationship
        const categoryUpdate = categoryIds !== undefined ? {
            categories: {
                // Delete all existing category relationships
                deleteMany: {},
                // Create new category relationships
                create: categoryIds.map((categoryId: number) => ({
                    category: {
                        connect: { id: Number(categoryId) }
                    }
                }))
            }
        } : {}

        const updateProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description: description !== undefined ? description : undefined,
                price: price != null ? Number(price) : undefined,
                stock: stock != null ? Number(stock) : undefined,
                ...categoryUpdate
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return NextResponse.json(updateProduct);

    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Product update error" }, { status: 500 });
    }
}