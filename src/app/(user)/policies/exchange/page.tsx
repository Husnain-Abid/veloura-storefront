export default function ExchangePolicy() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-serif mb-12">Exchange Policy</h1>
      
      <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">No Refund Policy</h2>
          <p className="leading-relaxed">
            Please note that Elegance Pakistan follows a strict <strong>EXCHANGE ONLY</strong> policy. We do not offer refunds under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Exchange Terms</h2>
          <p className="leading-relaxed">
            You can exchange any item within 7 days of purchase, provided that:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>The item is in its original condition with all tags intact.</li>
            <li>The item has not been worn, washed, or altered.</li>
            <li>You have the original receipt or proof of purchase.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Process</h2>
          <p className="leading-relaxed">
            To initiate an exchange, please contact our customer service via WhatsApp at +92 300 1234567 or email us at support@elegance.pk. You will be responsible for the shipping costs of returning the item for exchange.
          </p>
        </section>

        <section className="bg-gray-50 p-8 border border-gray-100 italic">
          <p>
            &quot;We value our customers and strive to ensure you are happy with your purchase. While we don&apos;t offer refunds, we are more than happy to help you find an alternative style or size.&quot;
          </p>
        </section>
      </div>
    </div>
  );
}
