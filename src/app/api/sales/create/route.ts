import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

interface Product {
    productId: number;
    quantity: number;
    price: number;
}

export async function POST(req: Request) {
    try {
        const { items } = await req.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "The items were not received." }, { status: 400 });
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

            if (product.stock < item.quantity) {
                return NextResponse.json({ 
                    error: `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}` 
                }, { status: 400 });
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

        const sale = await prisma.sale.create({
            data: {
                totalAmount: total,
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

        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            })
        }

        return NextResponse.json(sale)

    } catch (error) {
        console.log(error)

        return NextResponse.json({ error: "Error creating sale" }, { status: 500 })
    }
}