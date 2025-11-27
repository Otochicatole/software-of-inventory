import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function DELETE(req:Request){
    try{
        const { id } = await req.json();

        if(!id){
            return NextResponse.json({ error: "The sale ID is missing." }, { status: 400 });
        }

        const sale = await prisma.sale.findUnique({
            where: { id: Number(id) },
            include: { items: { include: { product: true } } }
        });

        if (!sale) {
            return NextResponse.json({ error: "Sale not found." }, { status: 404 });
        }

        if (!sale.active) {
            return NextResponse.json({ error: "Sale is already inactive." }, { status: 400 });
        }

        for (const item of sale.items) {
            if (item.productId && item.product) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }
        }

        const deleteSale = await prisma.sale.update({
            where: { id: Number(id) },
            data:{ active: false },
            include: { items: true }
        })

        return NextResponse.json({ success: true, message: 'Successfully deleted sale and restored stock.', sale: deleteSale });

    } catch (error){
        console.log(error)

        return NextResponse.json({ error: "Error while deleting sale." }, { status: 500 });
    }
}