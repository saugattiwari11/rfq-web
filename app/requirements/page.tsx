import { supabase } from '@/lib/supabaseClient';

async function getRequirements() {
  // NOTE: replace with the signed-in business's own requirements once auth
  // context is wired up (filter by buyer_business_id).
  const { data, error } = await supabase
    .from('requirements')
    .select('id, title, city, status, expires_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export default async function RequirementsPage() {
  const requirements = await getRequirements();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-700">My Requirements</h1>
        <a href="/requirements/new" className="btn-primary">Create requirement</a>
      </div>

      {requirements.length === 0 ? (
        <div className="slip p-8 text-center text-muted">
          No requirements yet. Post what you need and verified sellers in
          your city will be notified.
        </div>
      ) : (
        <div className="slip">
          {requirements.map((r) => (
            <a key={r.id} href={`/requirements/${r.id}`} className="slip-row hover:bg-white/60 transition-colors">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted mt-0.5">{r.city} · expires {new Date(r.expires_at).toLocaleDateString()}</p>
              </div>
              <span className={r.status === 'open' ? 'stamp-verified' : 'stamp-pending'}>
                {r.status.toUpperCase()}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
