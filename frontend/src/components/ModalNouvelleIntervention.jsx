import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ModalNouvelleIntervention({ onFerme, onCree }) {
  const [clients, setClients] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [erreur, setErreur] = useState('');
  const [form, setForm] = useState({
    titre: '', description: '', adresseIntervention: '', clientId: '',
    priorite: 'normale', technicienId: '', datePlanifiee: ''
  });

  useEffect(() => {
    api.get('/clients').then((res) => setClients(res.data));
    api.get('/techniciens').then((res) => setTechniciens(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/interventions', {
        ...form,
        clientId: Number(form.clientId),
        technicienId: form.technicienId ? Number(form.technicienId) : null
      });
      onCree();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la création.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Nouvelle intervention</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Titre *</label>
            <input name="titre" value={form.titre} onChange={handleChange} required
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Adresse d'intervention</label>
            <input name="adresseIntervention" value={form.adresseIntervention} onChange={handleChange}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Site / Client *</label>
              <select name="clientId" value={form.clientId} onChange={handleChange} required
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Sélectionner...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Priorité</label>
              <select name="priorite" value={form.priorite} onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Technicien (optionnel)</label>
              <select name="technicienId" value={form.technicienId} onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Non affecté</option>
                {techniciens.filter(t => t.disponible).map((t) => (
                  <option key={t.id} value={t.id}>{t.User?.prenom} {t.User?.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Date planifiée</label>
              <input type="datetime-local" name="datePlanifiee" value={form.datePlanifiee} onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onFerme}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-ocp-600 hover:bg-ocp-700 text-white font-medium">
              Créer l'intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
