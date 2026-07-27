import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatutBadge from '../components/StatutBadge';
import PrioriteBadge from '../components/PrioriteBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ModalNouvelleIntervention from '../components/ModalNouvelleIntervention';

export default function Interventions() {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [chargement, setChargement] = useState(true);

  const charger = () => {
    setChargement(true);
    const params = filtreStatut ? { statut: filtreStatut } : {};
    api.get('/interventions', { params }).then((res) => {
      setInterventions(res.data);
      setChargement(false);
    });
  };

  useEffect(() => { charger(); }, [filtreStatut]);

  const peutCreer = ['admin', 'planificateur'].includes(user?.role);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Interventions</h2>
          <p className="text-slate-500">Planification et suivi des interventions terrain</p>
        </div>
        {peutCreer && (
          <button
            onClick={() => setModalOuvert(true)}
            className="bg-ocp-600 hover:bg-ocp-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Nouvelle intervention
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {['', 'nouvelle', 'planifiee', 'en_cours', 'terminee', 'annulee'].map((s) => (
          <button
            key={s}
            onClick={() => setFiltreStatut(s)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              filtreStatut === s ? 'bg-ocp-600 text-white border-ocp-600' : 'bg-white text-slate-600 border-slate-200 hover:border-ocp-400'
            }`}
          >
            {s === '' ? 'Toutes' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Site / Client</th>
              <th className="p-3">Technicien</th>
              <th className="p-3">Priorité</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Date planifiée</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interventions.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-3">
                  <Link to={`/interventions/${i.id}`} className="font-medium text-slate-800 hover:text-ocp-600">
                    {i.titre}
                  </Link>
                </td>
                <td className="p-3 text-slate-500">{i.Client?.nom || '—'}</td>
                <td className="p-3 text-slate-500">
                  {i.Technicien?.User ? `${i.Technicien.User.prenom} ${i.Technicien.User.nom}` : 'Non affecté'}
                </td>
                <td className="p-3"><PrioriteBadge priorite={i.priorite} /></td>
                <td className="p-3"><StatutBadge statut={i.statut} /></td>
                <td className="p-3 text-slate-500">
                  {i.datePlanifiee ? new Date(i.datePlanifiee).toLocaleDateString('fr-FR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!chargement && interventions.length === 0 && (
          <p className="p-6 text-center text-slate-400 text-sm">Aucune intervention trouvée.</p>
        )}
      </div>

      {modalOuvert && (
        <ModalNouvelleIntervention
          onFerme={() => setModalOuvert(false)}
          onCree={() => { setModalOuvert(false); charger(); }}
        />
      )}
    </Layout>
  );
}
