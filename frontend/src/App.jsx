/*
AuthProvider entoure tout → contexte disponible partout
Navbar affichée sur toutes les pages
Routes publiques : /login, /register, /, /voitures
Routes protégées : /admin/dashboard, /admin/voitures, /admin/clients, /admin/reservations → réservées aux admins
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // ← IMPORTANT !
import Navbar from './components/Navbar';

// Pages Publiques
import Home from './pages/Home';
import Voitures from './pages/voitures'; // ← Kawtar (public)
import Login from './pages/Login';
import Register from './pages/Register';

// Pages Admin
import Dashboard from './pages/admin/Dashboard';
import VoituresAdmin from './pages/admin/VoituresAdmin'; // ← Toi (admin)
import Clients from './pages/admin/Clients'; 
import Reservations from './pages/admin/Reservations'; 
import Statistiques from './pages/admin/Statistiques';

// Page Client
import MesReservations from './pages/MesReservations'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<Home />} />
                        <Route path="/voitures" element={<Voitures />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/mes-reservations" element={<MesReservations />} />

                        {/* Routes protégées (admin) */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute adminOnly={true}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/voitures" element={
                            <ProtectedRoute adminOnly={true}>
                                <VoituresAdmin />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/clients" element={
                            <ProtectedRoute adminOnly={true}>
                                <Clients />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/reservations" element={
                            <ProtectedRoute adminOnly={true}>
                                <Reservations />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/statistiques" element={
                            <ProtectedRoute adminOnly={true}>
                                <Statistiques />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;