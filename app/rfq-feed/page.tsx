import { supabase } from '@/lib/supabaseClient';

async function getOpenRequirements() {
  // NOTE: once auth + supplier_categories are wired up, filter this to
  // requirements whose requirement_items.category_id matches the signed-in
  // seller's supplier_categories and city — this is the core matching query.
  const { data, error } = await supabase
    .from('requirements')
    .select('id, title, city, expires_at, requirement_items(category_name, quantity)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export default async function RfqFeedPage() {
  const requirements = await getOpenRequirements();

  return (
    <div>
      <h1 className="text-2xl font-display font-700 mb-6">Incoming Requirements</h1>

      {requirements.length === 0 ? (
        <div className="slip p-8 text-center text-muted">
          No open requirements match your categories right now.
        </div>
      ) : (
        <div className="space-y-3">
          {requirements.map((r: any) => (
            <a key={r.id} href={`/rfq-feed/${r.id}`} className="slip block p-5 hover:bg-white/60 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{r.title}</p>
                <span className="text-xs text-muted">expires {new Date(r.expires_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted mb-3">📍 {r.city}</p>
              <div className="flex flex-wrap gap-2">
                {(r.requirement_items ?? []).map((item: any, i: number) => (
                  <span key={i} className="text-xs border border-line/25 px-2 py-1">
                    {item.category_name ?? 'Item'} × {item.quantity}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
