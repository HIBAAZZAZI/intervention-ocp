import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Rapports() {
  const [rapports, setRapports] = useState([]);

  useEffect(() => {
    api.get('/rapports').then((res) => setRapports(res.data));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Rapports d'intervention</h2>
      <p className="text-slate-500 mb-6">Historique des interventions clôturées</p>

      <div className="space-y-4">
        {rapports.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <Link to={`/interventions/${r.interventionId}`} className="font-semibold text-slate-800 hover:text-ocp-600">
                {r.Intervention?.titre}
              </Link>
              <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <p className="text-sm text-slate-500 mb-2">
              Site : {r.Intervention?.Client?.nom} — Technicien : {r.Technicien?.User?.prenom} {r.Technicien?.User?.nom}
            </p>
            <p className="text-sm text-slate-700"><strong>Tâches réalisées :</strong> {r.tachesRealisees}</p>
            {r.observations && <p className="text-sm text-slate-600 mt-1"><strong>Observations :</strong> {r.observations}</p>}
          </div>
        ))}
        {rapports.length === 0 && (
          <p className="text-sm text-slate-400 bg-white rounded-xl border border-slate-100 p-6 text-center">
            Aucun rapport généré pour le moment.
          </p>
        )}
      </div>
    </Layout>
  );
}
