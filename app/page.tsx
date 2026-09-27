export default function HomePage() {
  return (
    <div>
      <section className="border-b border-line/20 pb-10 mb-10">
        <p className="text-copper font-medium text-sm mb-3">Pokhara · Electrical & Home Appliances</p>
        <h1 className="text-4xl md:text-5xl font-display font-700 leading-[1.1] max-w-2xl mb-5">
          Post what you need.
          <br />
          Let verified sellers quote.
        </h1>
        <p className="text-muted max-w-lg mb-8 leading-relaxed">
          One requirement reaches every relevant wholesaler, retailer, or
          contractor who can supply it. You compare real quotations side by
          side and choose who to buy from — no more calling five suppliers
          for the same order.
        </p>
        <div className="flex gap-3">
          <a href="/requirements/new" className="btn-primary">Create a requirement</a>
          <a href="/rfq-feed" className="btn-secondary">See incoming RFQs</a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-px bg-line/15">
        {[
          { step: 'Post', body: 'Describe what you need, how many, and by when.' },
          { step: 'Receive', body: 'Verified sellers in your category and city are notified.' },
          { step: 'Compare', body: 'Line up quotations on price, delivery, and warranty — then choose.' },
        ].map((item) => (
          <div key={item.step} className="bg-paper p-6">
            <h3 className="font-display font-600 text-lg mb-2">{item.step}</h3>
            <p className="text-sm text-muted leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
