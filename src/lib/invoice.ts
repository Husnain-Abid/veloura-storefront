import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = (order: any) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.text("ELEGANCE FASHION", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text("Premium Women's Fashion Pakistan", 105, 28, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Order Number: ${order.orderNumber}`, 20, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 52);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 20, 59);

  // Customer Info
  doc.text("Shipping Address:", 20, 75);
  doc.setFontSize(10);
  const addr = order.shippingAddress;
  doc.text(`${addr.firstName} ${addr.lastName}`, 20, 82);
  doc.text(addr.address, 20, 87);
  doc.text(`${addr.city}, Pakistan`, 20, 92);
  doc.text(addr.email, 20, 97);

  // Table
  const tableData = order.items.map((item: any) => [
    item.product.name,
    `${item.size} / ${item.color}`,
    item.quantity.toString(),
    `PKR ${item.price}`,
    `PKR ${Number(item.price) * item.quantity}`
  ]);

  (doc as any).autoTable({
    startY: 110,
    head: [['Product', 'Size/Color', 'Qty', 'Price', 'Total']],
    body: tableData,
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text(`Subtotal: PKR ${order.subtotal}`, 140, finalY);
  doc.text(`Shipping: PKR ${order.shippingFee}`, 140, finalY + 7);
  doc.setFontSize(12);
  doc.text(`Grand Total: PKR ${order.total}`, 140, finalY + 17);

  return doc;
};
