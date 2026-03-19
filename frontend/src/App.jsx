/*AuthProvider entoure tout → contexte disponible partout
Navbar affichée sur toutes les pages
Routes publiques : /login, /register, /
Routes protégées : /admin/dashboard, /admin/voitures → réservées aux admins
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import Voitures from './pages/admin/Voitures'; // AJOUTÉ PAR FADMA

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />

                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        {/* AJOUTÉ PAR FADMA : page gestion des voitures */}
                        <Route
                            path="/admin/voitures"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <Voitures />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;