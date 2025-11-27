import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

interface Product {
    productId: number;
    quantity: number;
    price: number;
}

export async function POST(req: Request) {
    try {
        const { items, reference } = await req.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "The items were not received." }, { status: 400 });
        }

        if (!reference || reference.trim() === '') {
            return NextResponse.json({ error: "La referencia (nombre del cliente) es requerida." }, { status: 400 });
        }

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return NextResponse.json({ 
                    error: `Product with ID ${item.productId} not found.` 
                }, { status: 404 });
            }
        }

        let total = 0;
        items.forEach((item: Product) => {
            total += item.price * item.quantity;
        })

        const productsData = await prisma.product.findMany({
            where: {
                id: { in: items.map((item: Product) => item.productId) }
            }
        });

        const productNamesById = productsData.reduce((acc, product) => {
            acc[product.id] = product.name;
            return acc;
        }, {} as Record<number, string>);

        const quotation = await prisma.quotation.create({
            data: {
                totalAmount: total,
                reference: reference.trim(),
                items: {
                    create: items.map((item: Product) => ({
                        productId: item.productId,
                        productName: productNamesById[item.productId] || 'Producto desconocido',
                        quantity: item.quantity,
                        price: item.price
                    })),
                },
            },
            include: { 
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json(quotation)

    } catch (error) {
        console.log(error)

        return NextResponse.json({ error: "Error creating quotation" }, { status: 500 })
    }
}

