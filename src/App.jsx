// src/App.jsx
// Componente principal da aplicação

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NetworkBackground from './components/layout/NetworkBackground';
import Home from './pages/Home';
import HonorRoll from './pages/HonorRoll';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="min-h-screen antialiased font-sans text-text-light dark:text-text-dark transition-colors duration-300">
          <NetworkBackground />
          <div className="relative z-10">
            <Routes>
              {/* Rota da página de administração */}
              <Route 
                path="/admin/dev" 
                element={<Admin />} 
              />
              
              {/* Rota da página Honra ao Mérito */}
              <Route 
                path="/honra-ao-merito" 
                element={
                  <>
                    <Header />
                    <main>
                      <HonorRoll />
                    </main>
                    <Footer />
                  </>
                } 
              />
              
              {/* Rota principal */}
              <Route 
                path="/" 
                element={
                  <>
                    <Header />
                    <main>
                      <Home />
                    </main>
                    <Footer />
                  </>
                } 
              />

              {/* Redireciona qualquer outra rota para a home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;