import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

function CarteStat({ titre, valeur, sousTitre, couleur }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
      <p className="text-sm text-slate-500">{titre}</p>
      <p className={`text-3xl font-bold mt-1 ${couleur || 'text-slate-800'}`}>{valeur}</p>
      {sousTitre && <p className="text-xs text-slate-400 mt-1">{sousTitre}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [interventions, setInterventions] = useState([]);

  useEffect(() => {
    api.get('/stats/dashboard').then((res) => setStats(res.data));
    api.get('/interventions').then((res) => setInterventions(res.data.slice(0, 5)));
  }, []);

  if (!stats) return <Layout><p className="text-slate-500">Chargement...</p></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Tableau de bord</h2>
      <p className="text-slate-500 mb-6">Vue d'ensemble des interventions - Site de Khouribga</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CarteStat titre="Interventions totales" valeur={stats.interventions.total} />
        <CarteStat titre="En cours" valeur={stats.interventions.enCours} couleur="text-amber-600" />
        <CarteStat titre="Techniciens disponibles" valeur={`${stats.techniciens.disponibles}/${stats.techniciens.total}`} couleur="text-ocp-600" />
        <CarteStat titre="Alertes stock" valeur={stats.stock.alertes} sousTitre={`sur ${stats.stock.totalReferences} références`} couleur="text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <CarteStat titre="Nouvelles" valeur={stats.interventions.nouvelles} />
        <CarteStat titre="Planifiées" valeur={stats.interventions.planifiees} />
        <CarteStat titre="Terminées" valeur={stats.interventions.terminees} />
        <CarteStat titre="Taux de complétion" valeur={stats.interventions.total ? `${Math.round((stats.interventions.terminees / stats.interventions.total) * 100)}%` : '0%'} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-700">Dernières interventions</h3>
          <Link to="/interventions" className="text-sm text-ocp-600 hover:underline">Voir tout</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {interventions.map((i) => (
            <Link
              key={i.id}
              to={`/interventions/${i.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-medium text-slate-800">{i.titre}</p>
                <p className="text-xs text-slate-400">{i.Client?.nom}</p>
              </div>
              <span className="text-xs uppercase text-slate-400">{i.statut.replace('_', ' ')}</span>
            </Link>
          ))}
          {interventions.length === 0 && (
            <p className="p-4 text-sm text-slate-400">Aucune intervention pour le moment.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
