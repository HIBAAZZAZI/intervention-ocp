const STYLES = {
  nouvelle: 'bg-slate-200 text-slate-700',
  planifiee: 'bg-blue-100 text-blue-700',
  en_cours: 'bg-amber-100 text-amber-800',
  terminee: 'bg-ocp-100 text-ocp-700',
  annulee: 'bg-red-100 text-red-700'
};

const LABELS = {
  nouvelle: 'Nouvelle',
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée'
};

export default function StatutBadge({ statut }) {
  return (
    <span className={`badge ${STYLES[statut] || 'bg-slate-100 text-slate-600'}`}>
      {LABELS[statut] || statut}
    </span>
  );
}
