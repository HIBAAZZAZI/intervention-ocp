import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@ocp-khouribga.ma');
  const [password, setPassword] = useState('password123');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur de connexion.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocp-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-ocp-900">Groupe OCP</h1>
          <p className="text-slate-500 text-sm mt-1">Gestion des Interventions — Khouribga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ocp-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ocp-500"
              required
            />
          </div>

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-ocp-600 hover:bg-ocp-700 text-white font-medium rounded-lg py-2.5 transition disabled:opacity-60"
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
          <p className="font-semibold mb-1">Comptes de démonstration :</p>
          <p>admin@ocp-khouribga.ma / planificateur@ocp-khouribga.ma</p>
          <p>youssef.elamrani@ocp-khouribga.ma</p>
          <p>Mot de passe : password123</p>
        </div>
      </div>
    </div>
  );
}
