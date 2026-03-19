import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages Publiques
import Home from './pages/Home';
import Voitures from './pages/Voitures';
import Login from './pages/Login';
import Register from './pages/Register';

// Pages Admin
import Clients from './pages/admin/Clients'; 
import Reservations from './pages/admin/Reservations'; 
import Statistiques from './pages/admin/Statistiques';
import VoituresAdmin from './pages/admin/VoituresAdmin'; 

// Page Client
import MesReservations from './pages/MesReservations'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/voitures" element={<Voitures />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/clients" element={<Clients />} />
                        <Route path="/admin/reservations" element={<Reservations />} />
                        <Route path="/admin/statistiques" element={<Statistiques />} />
                        <Route path="/admin/voitures" element={<VoituresAdmin />} />
                        <Route path="/mes-reservations" element={<MesReservations />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;