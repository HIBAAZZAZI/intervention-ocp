import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Stocks() {
  const { user } = useAuth();
  const [pieces, setPieces] = useState([]);
  const [pieceSelectionnee, setPieceSelectionnee] = useState(null);
  const [mouvement, setMouvement] = useState({ type: 'sortie', quantite: 1, motif: '' });
  const [nouvellePiece, setNouvellePiece] = useState({ reference: '', designation: '', unite: 'unité', quantiteStock: 0, seuilAlerte: 5 });
  const [afficherAjout, setAfficherAjout] = useState(false);

  const charger = () => api.get('/stocks').then((res) => setPieces(res.data));
  useEffect(() => { charger(); }, []);

  const enregistrerMouvement = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/stocks/${pieceSelectionnee.id}/mouvement`, mouvement);
      setPieceSelectionnee(null);
      setMouvement({ type: 'sortie', quantite: 1, motif: '' });
      charger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const creerPiece = async (e) => {
    e.preventDefault();
    await api.post('/stocks', nouvellePiece);
    setNouvellePiece({ reference: '', designation: '', unite: 'unité', quantiteStock: 0, seuilAlerte: 5 });
    setAfficherAjout(false);
    charger();
  };

  const peutGerer = ['admin', 'planificateur'].includes(user?.role);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Stock & Pièces détachées</h2>
          <p className="text-slate-500">Suivi des quantités et alertes de réapprovisionnement</p>
        </div>
        {peutGerer && (
          <button onClick={() => setAfficherAjout(!afficherAjout)}
            className="bg-ocp-600 hover:bg-ocp-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
            + Nouvelle référence
          </button>
        )}
      </div>

      {afficherAjout && (
        <form onSubmit={creerPiece} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6 grid grid-cols-2 gap-3">
          <input placeholder="Référence *" required value={nouvellePiece.reference}
            onChange={(e) => setNouvellePiece({ ...nouvellePiece, reference: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Désignation *" required value={nouvellePiece.designation}
            onChange={(e) => setNouvellePiece({ ...nouvellePiece, designation: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Unité" value={nouvellePiece.unite}
            onChange={(e) => setNouvellePiece({ ...nouvellePiece, unite: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Quantité initiale" value={nouvellePiece.quantiteStock}
            onChange={(e) => setNouvellePiece({ ...nouvellePiece, quantiteStock: Number(e.target.value) })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Seuil d'alerte" value={nouvellePiece.seuilAlerte}
            onChange={(e) => setNouvellePiece({ ...nouvellePiece, seuilAlerte: Number(e.target.value) })}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm col-span-2" />
          <button type="submit" className="col-span-2 bg-ocp-600 hover:bg-ocp-700 text-white text-sm py-2 rounded-lg">
            Ajouter au stock
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="p-3">Référence</th>
              <th className="p-3">Désignation</th>
              <th className="p-3">Quantité</th>
              <th className="p-3">Seuil d'alerte</th>
              <th className="p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pieces.map((p) => {
              const enAlerte = p.quantiteStock <= p.seuilAlerte;
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-600">{p.reference}</td>
                  <td className="p-3 text-slate-800">{p.designation}</td>
                  <td className="p-3 text-slate-600">{p.quantiteStock} {p.unite}</td>
                  <td className="p-3 text-slate-500">{p.seuilAlerte}</td>
                  <td className="p-3">
                    <span className={`badge ${enAlerte ? 'bg-red-100 text-red-700' : 'bg-ocp-100 text-ocp-700'}`}>
                      {enAlerte ? 'Stock faible' : 'OK'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => setPieceSelectionnee(p)} className="text-sm text-ocp-600 hover:underline">
                      Mouvement
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pieceSelectionnee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-800 mb-3">{pieceSelectionnee.designation}</h3>
            <form onSubmit={enregistrerMouvement} className="space-y-3">
              <select value={mouvement.type} onChange={(e) => setMouvement({ ...mouvement, type: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="sortie">Sortie (utilisation)</option>
                <option value="entree">Entrée (réapprovisionnement)</option>
              </select>
              <input type="number" min="1" value={mouvement.quantite}
                onChange={(e) => setMouvement({ ...mouvement, quantite: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Quantité" />
              <input value={mouvement.motif} onChange={(e) => setMouvement({ ...mouvement, motif: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Motif (ex: intervention #12)" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setPieceSelectionnee(null)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-ocp-600 text-white">Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
