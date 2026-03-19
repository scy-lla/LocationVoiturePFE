import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
// import Voitures from './pages/voitures'; // ← Kawtar (commenté temporairement)
import Dashboard from './pages/admin/Dashboard';
import VoituresAdmin from './pages/admin/VoituresAdmin'; // ← TON fichier

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/voitures" element={<Voitures />} /> */} ← Commenté
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute adminOnly={true}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/admin/voitures" element={
                            <ProtectedRoute adminOnly={true}>
                                <VoituresAdmin /> {/* ← TON fichier fonctionne ! */}
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;