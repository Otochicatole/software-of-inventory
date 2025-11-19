import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.error(error)

        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
    }
}

