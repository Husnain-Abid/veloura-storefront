import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order: any) => {
  const doc = new jsPDF();

  // =========================================================
  // HEADER
  // =========================================================

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Order #: ${order.orderNumber || order._id || order.id || "N/A"}`,
    14,
    30
  );

  doc.text(
    `Date: ${
      order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "N/A"
    }`,
    14,
    36
  );

  // =========================================================
  // CUSTOMER
  // =========================================================

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer", 14, 48);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Name: ${order.customer?.name || "N/A"}`, 14, 56);
  doc.text(`Email: ${order.customer?.email || "N/A"}`, 14, 62);
  doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 14, 68);

  // =========================================================
  // SHIPPING ADDRESS
  // =========================================================

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Address", 110, 48);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const shippingAddress = order.shippingAddress;

  doc.text(
    `${shippingAddress?.address || "N/A"}`,
    110,
    56
  );

  doc.text(
    `${shippingAddress?.city || ""}${
      shippingAddress?.province ? `, ${shippingAddress.province}` : ""
    }`,
    110,
    62
  );

  // =========================================================
  // PRODUCTS
  // =========================================================

  const tableData = (order.items || []).map((item: any) => {
    /*
     * Your order detail page may receive:
     *
     * item.productId
     *
     * while some APIs may return:
     *
     * item.product
     *
     * So support both.
     */

    const product = item.product || item.productId;

    const productName =
      typeof product === "object" && product?.name
        ? product.name
        : item.productName || "Product";

    const size = item.size || "-";
    const color =
      typeof item.color === "object"
        ? item.color?.name || "-"
        : item.color || "-";

    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0);

    return [
      productName,
      `${size} / ${color}`,
      quantity.toString(),
      `PKR ${price.toLocaleString()}`,
      `PKR ${(price * quantity).toLocaleString()}`,
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [
      [
        "Product",
        "Variant",
        "Qty",
        "Price",
        "Total",
      ],
    ],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  // =========================================================
  // TOTALS
  // =========================================================

  const finalY =
    (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 12
      : 100;

  const subtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shippingCost || order.shipping || 0);
  const discount = Number(order.discount || 0);
  const total = Number(
    order.total ||
      order.totalAmount ||
      subtotal + shipping - discount
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Subtotal: PKR ${subtotal.toLocaleString()}`,
    140,
    finalY
  );

  doc.text(
    `Shipping: PKR ${shipping.toLocaleString()}`,
    140,
    finalY + 7
  );

  if (discount > 0) {
    doc.text(
      `Discount: PKR ${discount.toLocaleString()}`,
      140,
      finalY + 14
    );
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total: PKR ${total.toLocaleString()}`,
    140,
    finalY + 24
  );

  // =========================================================
  // PAYMENT / STATUS
  // =========================================================

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Payment Method: ${order.paymentMethod || "N/A"}`,
    14,
    finalY + 24
  );

  doc.text(
    `Payment Status: ${order.paymentStatus || "N/A"}`,
    14,
    finalY + 31
  );

  doc.text(
    `Order Status: ${order.status || "N/A"}`,
    14,
    finalY + 38
  );

  // =========================================================
  // FOOTER
  // =========================================================

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for shopping with us!",
    14,
    285
  );

  // =========================================================
  // DOWNLOAD
  // =========================================================

  const orderNumber =
    order.orderNumber || order._id || order.id || "order";

  doc.save(`invoice-${orderNumber}.pdf`);
};