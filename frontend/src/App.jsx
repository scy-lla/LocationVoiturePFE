/* AuthProvider entoure tout → contexte disponible partout
   Navbar affichée sur toutes les pages
   Routes publiques : /login, /register, /
   Routes protégées : /admin/dashboard, /admin/clients → réservées aux admins
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages Publiques
import Home from './pages/Home';
import Voitures from './pages/voitures';
import Login from './pages/Login';
import Register from './pages/Register';

// 👇 AJOUT DES IMPORTS MANQUANTS POUR L'ADMIN
import Clients from './pages/admin/Clients'; 
import Reservations from './pages/admin/Reservations';
// Note: Si le fichier s'appelle ClientList.jsx ou autre, ajuste le nom ici.
// Si tu n'as pas encore de page Clients, tu peux commenter cette ligne et la route correspondante.

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        {/* Routes Publiques */}
                        <Route path="/" element={<Home />} />
                        <Route path="/voitures" element={<Voitures />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* 👇 AJOUT DES ROUTES PROTÉGÉES MANQUANTES */}
                        <Route path="/admin/clients" element={<Clients />} />
                        <Route path="/admin/reservations" element={<Reservations />} />
                        
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;