import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RouteProtegee from './components/RouteProtegee';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interventions from './pages/Interventions';
import InterventionDetail from './pages/InterventionDetail';
import Techniciens from './pages/Techniciens';
import Clients from './pages/Clients';
import Stocks from './pages/Stocks';
import Rapports from './pages/Rapports';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RouteProtegee><Dashboard /></RouteProtegee>} />
        <Route path="/interventions" element={<RouteProtegee><Interventions /></RouteProtegee>} />
        <Route path="/interventions/:id" element={<RouteProtegee><InterventionDetail /></RouteProtegee>} />
        <Route path="/techniciens" element={
          <RouteProtegee rolesAutorises={['admin', 'planificateur']}><Techniciens /></RouteProtegee>
        } />
        <Route path="/clients" element={
          <RouteProtegee rolesAutorises={['admin', 'planificateur']}><Clients /></RouteProtegee>
        } />
        <Route path="/stocks" element={<RouteProtegee><Stocks /></RouteProtegee>} />
        <Route path="/rapports" element={
          <RouteProtegee rolesAutorises={['admin', 'planificateur']}><Rapports /></RouteProtegee>
        } />
      </Routes>
    </AuthProvider>
  );
}
