import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const quotations = await prisma.quotation.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        })

        return NextResponse.json(quotations)
    } catch (error) {
        console.error('Error fetching quotations:', error)
        return NextResponse.json({ error: 'Error fetching quotations' }, { status: 500 })
    }
}

