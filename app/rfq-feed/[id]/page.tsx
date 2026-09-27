'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Item {
  id: string;
  category_name: string;
  specification: string | null;
  quantity: number;
  include: boolean;
  unit_price: string;
  brand: string;
  model: string;
  quantity_available: string;
}

export default function SubmitQuotationPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [warranty, setWarranty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('requirements')
        .select('title, requirement_items(*)')
        .eq('id', params.id)
        .single();

      if (data) {
        setTitle(data.title);
        setItems(
          (data.requirement_items ?? []).map((it: any) => ({
            id: it.id,
            category_name: it.category_name ?? 'Item',
            specification: it.specification,
            quantity: it.quantity,
            include: true,
            unit_price: '',
            brand: '',
            model: '',
            quantity_available: String(it.quantity),
          }))
        );
      }
    }
    load();
  }, [params.id]);

  function updateItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function submit() {
    setSubmitting(true);
    const { data: quotation, error } = await supabase
      .from('quotations')
      .insert({
        requirement_id: params.id,
        delivery_charge: Number(deliveryCharge) || 0,
        discount: Number(discount) || 0,
        delivery_time: deliveryTime || null,
        warranty: warranty || null,
        status: 'submitted',
      })
      .select()
      .single();

    if (error || !quotation) {
      console.error(error);
      setSubmitting(false);
      return;
    }

    const rowsToInsert = items
      .filter((it) => it.include && it.unit_price)
      .map((it) => ({
        quotation_id: quotation.id,
        requirement_item_id: it.id,
        brand: it.brand || null,
        model: it.model || null,
        unit_price: Number(it.unit_price),
        quantity_available: Number(it.quantity_available) || it.quantity,
      }));

    if (rowsToInsert.length > 0) {
      await supabase.from('quotation_items').insert(rowsToInsert);
    }

    setSubmitting(false);
    window.location.href = '/rfq-feed';
  }

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-copper font-medium mb-1">Submit quotation</p>
      <h1 className="text-2xl font-display font-700 mb-6">{title || '…'}</h1>

      <p className="text-sm text-muted mb-4">
        Quote only what you can supply — leave the rest unchecked.
      </p>

      <div className="slip mb-6">
        {items.map((item) => (
          <div key={item.id} className="slip-row flex-col items-stretch gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.include}
                onChange={(e) => updateItem(item.id, { include: e.target.checked })}
              />
              <span className="font-medium">
                {item.category_name} {item.specification ? `— ${item.specification}` : ''} × {item.quantity} needed
              </span>
            </label>

            {item.include && (
              <div className="grid grid-cols-4 gap-3 pl-6">
                <input
                  className="field-input"
                  placeholder="Brand"
                  value={item.brand}
                  onChange={(e) => updateItem(item.id, { brand: e.target.value })}
                />
                <input
                  className="field-input"
                  placeholder="Model"
                  value={item.model}
                  onChange={(e) => updateItem(item.id, { model: e.target.value })}
                />
                <input
                  type="number"
                  className="field-input"
                  placeholder="Unit price (Rs)"
                  value={item.unit_price}
                  onChange={(e) => updateItem(item.id, { unit_price: e.target.value })}
                />
                <input
                  type="number"
                  className="field-input"
                  placeholder="Qty available"
                  value={item.quantity_available}
                  onChange={(e) => updateItem(item.id, { quantity_available: e.target.value })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="slip p-5 mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Delivery charge (Rs)</label>
          <input className="field-input" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Discount (Rs)</label>
          <input className="field-input" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Delivery time</label>
          <input className="field-input" placeholder="e.g. 2 days" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Warranty</label>
          <input className="field-input" placeholder="e.g. 2 years" value={warranty} onChange={(e) => setWarranty(e.target.value)} />
        </div>
      </div>

      <button className="btn-primary" onClick={submit} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit quotation'}
      </button>
    </div>
  );
}
