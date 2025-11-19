import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json()

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required.' },
                { status: 400 }
            )
        }

        const category = await prisma.category.create({
            data: {
                name,
                description: description || '',
            },
        })

        return NextResponse.json(category)

    } catch (error: unknown) {
        console.error(error)

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category with this name already exists.' },
                { status: 400 }
            )
        }

        return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
    }
}

