import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Tableau de bord', icon: '📊', roles: ['admin', 'planificateur', 'technicien'] },
  { to: '/interventions', label: 'Interventions', icon: '🛠️', roles: ['admin', 'planificateur', 'technicien'] },
  { to: '/techniciens', label: 'Techniciens', icon: '👷', roles: ['admin', 'planificateur'] },
  { to: '/clients', label: 'Sites & Clients', icon: '🏭', roles: ['admin', 'planificateur'] },
  { to: '/stocks', label: 'Stock & Pièces', icon: '📦', roles: ['admin', 'planificateur', 'technicien'] },
  { to: '/rapports', label: 'Rapports', icon: '📄', roles: ['admin', 'planificateur'] }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-ocp-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-ocp-700">
        <h1 className="text-lg font-bold leading-tight">Groupe OCP</h1>
        <p className="text-xs text-ocp-100/80">Gestion des Interventions</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links
          .filter((l) => l.roles.includes(user?.role))
          .map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-ocp-600 text-white' : 'text-ocp-50/90 hover:bg-ocp-700'
                }`
              }
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-ocp-700">
        <p className="text-sm font-medium">{user?.prenom} {user?.nom}</p>
        <p className="text-xs text-ocp-100/70 capitalize mb-3">{user?.role}</p>
        <button
          onClick={logout}
          className="w-full text-sm bg-ocp-700 hover:bg-ocp-600 rounded-lg py-1.5 transition"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
