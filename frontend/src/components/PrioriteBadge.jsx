const STYLES = {
  basse: 'bg-slate-100 text-slate-600',
  normale: 'bg-sky-100 text-sky-700',
  haute: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700'
};

const LABELS = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente'
};

export default function PrioriteBadge({ priorite }) {
  return (
    <span className={`badge ${STYLES[priorite] || 'bg-slate-100 text-slate-600'}`}>
      {LABELS[priorite] || priorite}
    </span>
  );
}
