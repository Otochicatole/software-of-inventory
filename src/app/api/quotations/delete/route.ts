import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function DELETE(req:Request){
    try{
        const { id } = await req.json();

        if(!id){
            return NextResponse.json({ error: "The quotation ID is missing." }, { status: 400 });
        }

        const deleteQuotation = await prisma.quotation.delete({
            where: { id: Number(id) },
            include: { items: true }
        })

        return NextResponse.json({ success: true, message: 'Successfully deleted quotation.', quotation: deleteQuotation });

    } catch (error){
        console.log(error)

        return NextResponse.json({ error: "Error while deleting quotation." }, { status: 500 });
    }
}

