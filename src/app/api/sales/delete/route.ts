import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function DELETE(req:Request){
    try{
        const { id } = await req.json();

        if(!id){
            return NextResponse.json({ error: "The sale ID is missing." }, { status: 400 });
        }

        const deleteSale = await prisma.sale.update({
            where: { id: Number(id) },
            data:{ active: false },
            include: { items: true }
        })

        return NextResponse.json({ success: true, message: 'Successfully deleted sale.', sale: deleteSale });

    } catch (error){
        console.log(error)

        return NextResponse.json({ error: "Error while deleting sale." }, { status: 500 });
    }
}