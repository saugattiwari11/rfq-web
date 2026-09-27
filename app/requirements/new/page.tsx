'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LineItem {
  category_name: string;
  brand_preference: string;
  specification: string;
  quantity: number;
}

const emptyItem: LineItem = { category_name: '', brand_preference: '', specification: '', quantity: 1 };

export default function NewRequirementPage() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Pokhara');
  const [requiredBy, setRequiredBy] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ ...emptyItem }]);
  const [submitting, setSubmitting] = useState(false);

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function publish() {
    setSubmitting(true);
    // NOTE: category_name here should be resolved to a category_id from
    // product_categories before insert — left as a lookup step for wiring
    // up once the category table is seeded.
    const expires_at = requiredBy || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: requirement, error } = await supabase
      .from('requirements')
      .insert({ title, city, notes, required_by: requiredBy || null, expires_at, status: 'open' })
      .select()
      .single();

    if (error || !requirement) {
      console.error(error);
      setSubmitting(false);
      return;
    }

    // Insert line items (category_id resolution omitted for brevity)
    setSubmitting(false);
    window.location.href = `/requirements/${requirement.id}`;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-700 mb-6">Create a requirement</h1>

      <div className="slip p-5 mb-6 space-y-4">
        <div>
          <label className="field-label">Title</label>
          <input
            className="field-input"
            placeholder="e.g. House wiring — Lakeside"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">City</label>
            <input className="field-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Required by</label>
            <input type="date" className="field-input" value={requiredBy} onChange={(e) => setRequiredBy(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="slip mb-4">
        {items.map((item, i) => (
          <div key={i} className="slip-row flex-col items-stretch gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted font-medium">Item {i + 1}</p>
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} className="text-xs text-copper hover:underline">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              <input
                className="field-input col-span-2"
                placeholder="Product (e.g. Ceiling Fan)"
                value={item.category_name}
                onChange={(e) => updateItem(i, { category_name: e.target.value })}
              />
              <input
                className="field-input"
                placeholder="Brand (optional)"
                value={item.brand_preference}
                onChange={(e) => updateItem(i, { brand_preference: e.target.value })}
              />
              <input
                type="number"
                min={1}
                className="field-input"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
              />
            </div>
            <input
              className="field-input"
              placeholder="Specification (e.g. 48 inch, 12W, 16A)"
              value={item.specification}
              onChange={(e) => updateItem(i, { specification: e.target.value })}
            />
          </div>
        ))}
      </div>

      <button onClick={addItem} className="btn-secondary mb-8">+ Add another item</button>

      <div>
        <label className="field-label">Notes for sellers</label>
        <textarea
          className="field-input mb-6"
          rows={3}
          placeholder="Genuine product, warranty required, delivery required, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button onClick={publish} className="btn-primary" disabled={submitting || !title || items.length === 0}>
        {submitting ? 'Publishing…' : 'Request quotations'}
      </button>
    </div>
  );
}
