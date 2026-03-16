import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';

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
                        <Route
                            path="/admin/clients"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <Clients />
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