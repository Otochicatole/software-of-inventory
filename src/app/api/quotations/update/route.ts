import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

interface Product {
    productId: number;
    quantity: number;
    price: number;
}

export async function PUT(req: Request) {
    try {
        const { id, items } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "The quotation ID is missing." }, { status: 400 });
        }

        if (items && Array.isArray(items)) {
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
            });

            const productsData = await prisma.product.findMany({
                where: {
                    id: { in: items.map((item: Product) => item.productId) }
                }
            });

            const productNamesById = productsData.reduce((acc, product) => {
                acc[product.id] = product.name;
                return acc;
            }, {} as Record<number, string>);

            const updateQuotation = await prisma.quotation.update({
                where: { id: Number(id) },
                data: {
                    totalAmount: total,
                    items: {
                        deleteMany: {},
                        create: items.map((item: Product) => ({
                            productId: item.productId,
                            productName: productNamesById[item.productId] || 'Producto desconocido',
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return NextResponse.json(updateQuotation);
        }

        return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });

    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Quotation update error" }, { status: 500 });
    }
}

