import jsPDF from 'jspdf';
import { Quotation } from '@/core/types/quotation';

export const generateQuotationPDF = (quotation: Quotation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, 40, 'S');
    
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text('COTIZACIÓN', pageWidth / 2, 28, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`N° ${quotation.id.toString().padStart(6, '0')}`, pageWidth / 2, 42, { align: 'center' });
    
    const infoY = 60;
    
    doc.setLineWidth(0.3);
    doc.rect(15, infoY, pageWidth - 30, 35, 'S');
    
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.2);
    doc.line(15, infoY + 11.67, pageWidth - 15, infoY + 11.67);
    doc.line(15, infoY + 23.34, pageWidth - 15, infoY + 23.34);
    
    const date = new Date(quotation.date);
    const formattedDate = date.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    doc.setDrawColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    doc.text('FECHA:', 20, infoY + 8);
    doc.text('CLIENTE:', 20, infoY + 19.67);
    doc.text('ESTADO:', 20, infoY + 31.34);
    
    doc.setFont(undefined, 'normal');
    
    doc.text(formattedDate, 60, infoY + 8);
    doc.text(quotation.reference, 60, infoY + 19.67);
    
    const statusText = quotation.active ? 'APROBADA' : 'PENDIENTE';
    doc.setFont(undefined, 'bold');
    doc.text(statusText, 60, infoY + 31.34);
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('DETALLE DE PRODUCTOS', 20, 110);
    
    doc.setLineWidth(0.3);
    doc.line(20, 113, 120, 113);
    
    const tableStartY = 125;
    const tableWidth = pageWidth - 40;
    const colWidths = [tableWidth * 0.60, tableWidth * 0.15, tableWidth * 0.25];
    const headers = ['Producto', 'Cant.', 'Precio Unit.'];
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(20, tableStartY, tableWidth, 10, 'S');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    let xPos = 20;
    headers.forEach((header, index) => {
        const align = index === 0 ? 'left' : 'center';
        const textX = align === 'left' ? xPos + 3 : xPos + colWidths[index] / 2;
        doc.text(header, textX, tableStartY + 7, { align });
        
        if (index < headers.length - 1) {
            doc.setLineWidth(0.2);
            doc.line(xPos + colWidths[index], tableStartY, xPos + colWidths[index], tableStartY + 10);
        }
        
        xPos += colWidths[index];
    });
    
    doc.setFont(undefined, 'normal');
    
    let currentY = tableStartY + 10;
    
    quotation.items.forEach((item) => {
        if (currentY > pageHeight - 60) {
            doc.addPage();
            currentY = 20;
        }
        
        const productName = item.productName || item.product?.name || 'Producto eliminado';
        const quantity = item.quantity.toString();
        const price = `$${item.price.toFixed(2)}`;
        
        doc.setLineWidth(0.1);
        doc.setDrawColor(180, 180, 180);
        doc.line(20, currentY + 12, pageWidth - 20, currentY + 12);
        
        doc.setFontSize(9);
        
        xPos = 20;
        const maxWidth = colWidths[0] - 6;
        const lines = doc.splitTextToSize(productName, maxWidth);
        doc.text(lines[0], xPos + 3, currentY + 8);
        
        xPos += colWidths[0];
        doc.text(quantity, xPos + colWidths[1] / 2, currentY + 8, { align: 'center' });
        
        xPos += colWidths[1];
        doc.text(price, xPos + colWidths[2] / 2, currentY + 8, { align: 'center' });
        
        currentY += 12;
    });
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, currentY, pageWidth - 20, currentY);
    
    currentY += 10;
    
    if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
    }
    
    const totalBoxHeight = 25;
    const totalBoxWidth = 70;
    const totalBoxX = pageWidth - 90;
    
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 0, 0);
    doc.roundedRect(totalBoxX, currentY, totalBoxWidth, totalBoxHeight, 3, 3, 'S');
    
    doc.setLineWidth(0.3);
    doc.line(totalBoxX, currentY + 12, totalBoxX + totalBoxWidth, currentY + 12);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL', totalBoxX + totalBoxWidth / 2, currentY + 9, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`$${quotation.totalAmount.toFixed(2)}`, totalBoxX + totalBoxWidth / 2, currentY + 21, { align: 'center' });
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text('Este documento es una cotización y no constituye una factura válida.', pageWidth / 2, pageHeight - 20, { align: 'center' });
    
    doc.setFont(undefined, 'normal');
    doc.text(`Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    const fileName = `Cotizacion_${quotation.id.toString().padStart(6, '0')}_${quotation.reference.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
};
