import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatutBadge from '../components/StatutBadge';
import PrioriteBadge from '../components/PrioriteBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InterventionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [intervention, setIntervention] = useState(null);
  const [techniciens, setTechniciens] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [formRapport, setFormRapport] = useState({ tachesRealisees: '', observations: '' });
  const [afficherRapport, setAfficherRapport] = useState(false);

  const charger = () => {
    api.get(`/interventions/${id}`).then((res) => setIntervention(res.data));
  };

  useEffect(() => {
    charger();
    api.get('/techniciens').then((res) => setTechniciens(res.data));
  }, [id]);

  if (!intervention) return <Layout><p className="text-slate-500">Chargement...</p></Layout>;

  const peutGerer = ['admin', 'planificateur'].includes(user?.role);

  const affecterTechnicien = async (technicienId) => {
    await api.put(`/interventions/${id}/affecter`, { technicienId });
    charger();
  };

  const changerStatut = async (statut) => {
    await api.put(`/interventions/${id}/statut`, { statut });
    charger();
  };

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;
    await api.post(`/messages/intervention/${id}`, { contenu: nouveauMessage });
    setNouveauMessage('');
    charger();
  };

  const soumettreRapport = async (e) => {
    e.preventDefault();
    await api.post(`/rapports/intervention/${id}`, formRapport);
    setAfficherRapport(false);
    charger();
  };

  return (
    <Layout>
      <button onClick={() => navigate('/interventions')} className="text-sm text-slate-500 hover:text-ocp-600 mb-4">
        ← Retour aux interventions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{intervention.titre}</h2>
                <p className="text-slate-500 text-sm mt-1">{intervention.Client?.nom} — {intervention.adresseIntervention}</p>
              </div>
              <div className="flex gap-2">
                <PrioriteBadge priorite={intervention.priorite} />
                <StatutBadge statut={intervention.statut} />
              </div>
            </div>
            <p className="text-slate-600 mt-4 text-sm">{intervention.description || 'Aucune description fournie.'}</p>

            <div className="flex gap-2 mt-5 flex-wrap">
              {intervention.statut !== 'en_cours' && intervention.statut !== 'terminee' && (
                <button onClick={() => changerStatut('en_cours')}
                  className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg">
                  Démarrer l'intervention
                </button>
              )}
              {intervention.statut === 'en_cours' && (
                <button onClick={() => setAfficherRapport(true)}
                  className="text-sm bg-ocp-600 hover:bg-ocp-700 text-white px-3 py-1.5 rounded-lg">
                  Terminer & rédiger le rapport
                </button>
              )}
              {peutGerer && intervention.statut !== 'annulee' && intervention.statut !== 'terminee' && (
                <button onClick={() => changerStatut('annulee')}
                  className="text-sm border border-red-300 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg">
                  Annuler
                </button>
              )}
            </div>
          </div>

          {afficherRapport && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-700 mb-3">Rapport d'intervention</h3>
              <form onSubmit={soumettreRapport} className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Tâches réalisées *</label>
                  <textarea required rows={3} value={formRapport.tachesRealisees}
                    onChange={(e) => setFormRapport({ ...formRapport, tachesRealisees: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Observations</label>
                  <textarea rows={2} value={formRapport.observations}
                    onChange={(e) => setFormRapport({ ...formRapport, observations: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="text-sm bg-ocp-600 hover:bg-ocp-700 text-white px-4 py-2 rounded-lg">
                  Valider et clôturer l'intervention
                </button>
              </form>
            </div>
          )}

          {intervention.Rapport && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-700 mb-2">Rapport final</h3>
              <p className="text-sm text-slate-600"><strong>Tâches réalisées :</strong> {intervention.Rapport.tachesRealisees}</p>
              {intervention.Rapport.observations && (
                <p className="text-sm text-slate-600 mt-2"><strong>Observations :</strong> {intervention.Rapport.observations}</p>
              )}
            </div>
          )}

          {/* Communication */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-700 mb-3">Communication</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
              {intervention.Messages?.length ? intervention.Messages.map((m) => (
                <div key={m.id} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 font-medium">{m.auteur?.prenom} {m.auteur?.nom}</p>
                  <p className="text-sm text-slate-700">{m.contenu}</p>
                </div>
              )) : <p className="text-sm text-slate-400">Aucun message pour cette intervention.</p>}
            </div>
            <form onSubmit={envoyerMessage} className="flex gap-2">
              <input value={nouveauMessage} onChange={(e) => setNouveauMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="bg-ocp-600 hover:bg-ocp-700 text-white text-sm px-4 rounded-lg">
                Envoyer
              </button>
            </form>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Affectation</h3>
            <p className="text-sm text-slate-600 mb-2">
              {intervention.Technicien?.User
                ? `${intervention.Technicien.User.prenom} ${intervention.Technicien.User.nom}`
                : 'Aucun technicien affecté'}
            </p>
            {peutGerer && (
              <select
                value={intervention.technicienId || ''}
                onChange={(e) => affecterTechnicien(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Choisir un technicien...</option>
                {techniciens.map((t) => (
                  <option key={t.id} value={t.id} disabled={!t.disponible}>
                    {t.User?.prenom} {t.User?.nom} {!t.disponible ? '(indisponible)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Dates</h3>
            <p className="text-xs text-slate-500">Créée le</p>
            <p className="text-sm text-slate-700 mb-2">{new Date(intervention.createdAt).toLocaleString('fr-FR')}</p>
            {intervention.datePlanifiee && (
              <>
                <p className="text-xs text-slate-500">Planifiée pour</p>
                <p className="text-sm text-slate-700 mb-2">{new Date(intervention.datePlanifiee).toLocaleString('fr-FR')}</p>
              </>
            )}
            {intervention.dateDebut && (
              <>
                <p className="text-xs text-slate-500">Démarrée le</p>
                <p className="text-sm text-slate-700 mb-2">{new Date(intervention.dateDebut).toLocaleString('fr-FR')}</p>
              </>
            )}
            {intervention.dateFin && (
              <>
                <p className="text-xs text-slate-500">Terminée le</p>
                <p className="text-sm text-slate-700">{new Date(intervention.dateFin).toLocaleString('fr-FR')}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
