// src/App.jsx
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NetworkBackground from './components/layout/NetworkBackground';
import Home from './pages/Home';

function App() {
  // Adiciona smooth scroll para os links de navegação
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const target = e.target;
      
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Ajusta pelo tamanho do header
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.body.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.body.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen antialiased font-sans text-text-light dark:text-text-dark transition-colors duration-300">
        <NetworkBackground />
        <div className="relative z-10">
          <Header />
          <main>
            <Home />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;