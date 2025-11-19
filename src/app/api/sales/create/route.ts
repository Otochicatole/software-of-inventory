import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

interface Product {
    productId: number;
    quantity: number;
    price: number;
}

export async function  POST(req: Request){
    try {
        const { items } = await req.json()

        if(!items || !Array.isArray(items) || items.length === 0 ) {
            return NextResponse.json({ error: "The items were not received." }, { status: 400 });
        }

        let total = 0;
        items.forEach((item: Product)=> {
            total += item.price * item.quantity;
        })

        const sale = await prisma.sale.create({
            data:{
                totalAmount: total,
                items:{
                    create: items.map((item: Product)=>({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                },
            },
            include: { items: true }
        })

        for(const item of items){
            await prisma.product.update({
                where: { id:item.productId },
                data: { stock: { decrement: item.quantity }, },
            })
        }

        return NextResponse.json(sale)

    } catch (error){
        console.log(error)

        return NextResponse.json({ error: "Error creating sale" }, { status: 500 })
    }

}