import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({ error: "The quotation ID is missing." }, { status: 400 });
        }

        const quotation = await prisma.quotation.findUnique({
            where: { id: Number(id) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
        }

        if (quotation.active) {
            return NextResponse.json({ error: "Esta cotización ya fue aprobada." }, { status: 400 });
        }

        for (const item of quotation.items) {
            if (!item.product) {
                return NextResponse.json({ 
                    error: `El producto "${item.productName}" ya no existe.` 
                }, { status: 404 });
            }

            if (item.product.stock < item.quantity) {
                return NextResponse.json({ 
                    error: `Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}, Requerido: ${item.quantity}` 
                }, { status: 400 });
            }
        }

        const sale = await prisma.sale.create({
            data: {
                totalAmount: quotation.totalAmount,
                items: {
                    create: quotation.items.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
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

        for (const item of quotation.items) {
            if (item.productId) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
        }

        await prisma.quotation.update({
            where: { id: Number(id) },
            data: { active: true }
        });

        return NextResponse.json({ success: true, sale, quotation });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Error approving quotation" }, { status: 500 })
    }
}
