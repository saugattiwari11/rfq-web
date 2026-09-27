import { supabase } from '@/lib/supabaseClient';

async function getRequirementWithQuotations(id: string) {
  const { data: requirement } = await supabase
    .from('requirements')
    .select('*, requirement_items(*)')
    .eq('id', id)
    .single();

  const { data: quotations } = await supabase
    .from('quotations')
    .select('*, quotation_items(*), businesses:seller_business_id(business_name, verification_status)')
    .eq('requirement_id', id);

  return { requirement, quotations: quotations ?? [] };
}

function total(q: any) {
  const productSubtotal = (q.quotation_items ?? []).reduce(
    (sum: number, item: any) => sum + item.unit_price * item.quantity_available,
    0
  );
  return productSubtotal + (q.delivery_charge ?? 0) - (q.discount ?? 0);
}

export default async function RequirementDetailPage({ params }: { params: { id: string } }) {
  const { requirement, quotations } = await getRequirementWithQuotations(params.id);

  if (!requirement) {
    return <p className="text-muted">Requirement not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-copper font-medium mb-1">{requirement.city} · {requirement.status.toUpperCase()}</p>
        <h1 className="text-2xl font-display font-700 mb-3">{requirement.title}</h1>
        <div className="slip">
          {(requirement.requirement_items ?? []).map((item: any) => (
            <div key={item.id} className="slip-row">
              <span>{item.category_name ?? 'Item'} {item.specification ? `— ${item.specification}` : ''}</span>
              <span className="text-muted text-sm">× {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-lg font-display font-600 mb-4">
        Quotations received ({quotations.length})
      </h2>

      {quotations.length === 0 ? (
        <div className="slip p-8 text-center text-muted">
          No quotations yet. Sellers matching your category and city have been notified.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quotations.map((q: any) => (
            <div key={q.id} className="slip p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium">{q.businesses?.business_name ?? 'Seller'}</p>
                {q.businesses?.verification_status === 'verified' && (
                  <span className="stamp-verified">✓ VERIFIED</span>
                )}
              </div>

              <div className="text-sm space-y-1.5 mb-4">
                {(q.quotation_items ?? []).map((item: any) => (
                  <div key={item.id} className="flex justify-between text-muted">
                    <span>{item.brand ?? ''} {item.model ?? ''} × {item.quantity_available}</span>
                    <span>Rs {item.unit_price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-line/20 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Delivery</span>
                  <span>Rs {(q.delivery_charge ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Discount</span>
                  <span>− Rs {(q.discount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-1">
                  <span>Total</span>
                  <span>Rs {total(q).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-4 text-xs text-muted">
                {q.warranty && <span>Warranty: {q.warranty}</span>}
                {q.delivery_time && <span>Delivery: {q.delivery_time}</span>}
              </div>

              <button className="btn-primary w-full mt-5">Select this quotation</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
