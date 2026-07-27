import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ nom: '', site: '', adresse: '', telephone: '', email: '' });
  const [afficherForm, setAfficherForm] = useState(false);

  const charger = () => api.get('/clients').then((res) => setClients(res.data));
  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/clients', form);
    setForm({ nom: '', site: '', adresse: '', telephone: '', email: '' });
    setAfficherForm(false);
    charger();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sites & Clients</h2>
          <p className="text-slate-500">Sites internes du Groupe OCP suivis par l'application</p>
        </div>
        <button onClick={() => setAfficherForm(!afficherForm)}
          className="bg-ocp-600 hover:bg-ocp-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          + Ajouter un site
        </button>
      </div>

      {afficherForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6 grid grid-cols-2 gap-3">
          <input placeholder="Nom du site *" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Site / localisation" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm col-span-2" />
          <button type="submit" className="col-span-2 bg-ocp-600 hover:bg-ocp-700 text-white text-sm py-2 rounded-lg">
            Enregistrer
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800">{c.nom}</h3>
            <p className="text-sm text-slate-500">{c.site}</p>
            <p className="text-sm text-slate-500">{c.adresse}</p>
            <p className="text-sm text-slate-500">{c.telephone}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
