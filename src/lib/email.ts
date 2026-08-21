import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASS || "pass",
  },
});

export const sendOrderConfirmationEmail = async (order: any) => {
  const mailOptions = {
    from: '"Elegance Fashion" <orders@elegance.pk>',
    to: order.shippingAddress.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    text: `Thank you for your order! Your order number is ${order.orderNumber}.`,
    html: `<h1>Order Confirmation</h1><p>Thank you for shopping with Elegance. Your order <b>${order.orderNumber}</b> has been received and is being processed.</p>`,
  };

  try {
    // In actual sandbox, this might fail if credentials are not real, so we wrap in try-catch
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent");
  } catch (err) {
    console.warn("Email sending failed (likely missing credentials)", err);
  }
};
