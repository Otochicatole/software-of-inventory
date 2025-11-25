import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
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

        return NextResponse.json(sales)
    } catch (error) {
        console.error('Error fetching sales:', error)
        return NextResponse.json({ error: 'Error fetching sales' }, { status: 500 })
    }
}

