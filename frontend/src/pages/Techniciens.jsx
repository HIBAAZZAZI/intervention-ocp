import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Techniciens() {
  const [techniciens, setTechniciens] = useState([]);

  const charger = () => api.get('/techniciens').then((res) => setTechniciens(res.data));

  useEffect(() => {
    charger();
    // Rafraîchissement périodique pour simuler le suivi en temps réel des positions
    const interval = setInterval(charger, 15000);
    return () => clearInterval(interval);
  }, []);

  const basculerDisponibilite = async (t) => {
    await api.put(`/techniciens/${t.id}/disponibilite`, { disponible: !t.disponible });
    charger();
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Techniciens</h2>
      <p className="text-slate-500 mb-6">Disponibilité et localisation des équipes terrain</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techniciens.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-800">{t.User?.prenom} {t.User?.nom}</h3>
              <span className={`badge ${t.disponible ? 'bg-ocp-100 text-ocp-700' : 'bg-slate-200 text-slate-600'}`}>
                {t.disponible ? 'Disponible' : 'Indisponible'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">📍 {t.zoneAffectation}</p>
            <p className="text-sm text-slate-500 mb-1">🔧 {t.competences}</p>
            <p className="text-sm text-slate-500 mb-3">📞 {t.User?.telephone}</p>

            {t.latitude && (
              <p className="text-xs text-slate-400 mb-3">
                Dernière position : {t.latitude.toFixed(4)}, {t.longitude.toFixed(4)}
                {t.derniereMiseAJourPosition && (
                  <> — {new Date(t.derniereMiseAJourPosition).toLocaleTimeString('fr-FR')}</>
                )}
              </p>
            )}

            {t.Interventions?.length > 0 && (
              <p className="text-xs bg-amber-50 text-amber-700 rounded-lg px-2 py-1 mb-3">
                En intervention : {t.Interventions[0].titre}
              </p>
            )}

            <button
              onClick={() => basculerDisponibilite(t)}
              className="w-full text-sm border border-slate-300 rounded-lg py-1.5 hover:bg-slate-50"
            >
              Marquer {t.disponible ? 'indisponible' : 'disponible'}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
