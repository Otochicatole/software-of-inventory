import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if(!id){
            return NextResponse.json({ error: 'Product id required.' }, { status: 400 });
        }

        const deleteProduct = await prisma.product.delete({
            where: {id: Number(id)},
        });

        return NextResponse.json({ message: 'Product deleted successfully.', product: deleteProduct });

    } catch (error){
        console.error(error);

        return NextResponse.json({ err:'Error deleting the product.' },{ status: 500 })
    }

}