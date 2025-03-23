// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detecta o scroll para alterar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'py-2 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm shadow-md' 
          : 'py-4 bg-transparent'}
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/logo.svg" 
            alt="DevClub Logo" 
            className="h-10 w-auto mr-2"
          />
          <span className="text-xl font-bold text-secondary-dark dark:text-primary">
            DevClub <span className="text-primary dark:text-white">Stars</span>
          </span>
        </div>

        {/* Menu de navegação (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#sobre" 
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
          >
            Sobre
          </a>
          <a 
            href="#destaques" 
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
          >
            Destaques
          </a>
          <a 
            href="#historias" 
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
          >
            Histórias
          </a>
          <div className="flex items-center space-x-4 ml-4">
            <ThemeToggle />
            <Button 
              href="https://devclub.com" 
              target="_blank" 
              variant="outline"
            >
              Falar com Suporte
            </Button>
            <Button 
              href="https://devclub.com" 
              target="_blank"
            >
              Entrar no DevClub
            </Button>
          </div>
        </nav>

        {/* Menu hamburguer (Mobile) */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-text-light dark:text-text-dark focus:outline-none"
            aria-label="Menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      <div 
        className={`
          md:hidden absolute w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm
          shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <a 
            href="#sobre" 
            className="py-2 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sobre
          </a>
          <a 
            href="#destaques" 
            className="py-2 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Destaques
          </a>
          <a 
            href="#historias" 
            className="py-2 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Histórias
          </a>
          <hr className="border-gray-200 dark:border-gray-700" />
          <Button 
            href="https://devclub.com" 
            target="_blank" 
            variant="secondary"
            fullWidth
            className="dark:bg-primary dark:text-secondary dark:hover:bg-primary-dark"
          >
            Falar com Suporte
          </Button>
          <Button 
            href="https://devclub.com" 
            target="_blank"
            fullWidth
          >
            Entrar no DevClub
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;