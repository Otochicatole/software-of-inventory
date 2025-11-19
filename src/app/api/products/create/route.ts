import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { name, description, price, stock, categoryIds } = await req.json()

        if (!name || price == null || stock == null) {
            return NextResponse.json(
                { error: 'Required fields are missing.' },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                price: Number(price),
                stock: Number(stock),
                categories: categoryIds && categoryIds.length > 0 ? {
                    create: categoryIds.map((categoryId: number) => ({
                        category: {
                            connect: { id: Number(categoryId) }
                        }
                    }))
                } : undefined
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.error(error)

        return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
    }
}
