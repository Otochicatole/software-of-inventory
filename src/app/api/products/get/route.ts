import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.error(error)

        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
    }
}