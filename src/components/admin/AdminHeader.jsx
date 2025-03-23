// src/components/admin/AdminHeader.jsx
// Cabeçalho da página de administração

import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const AdminHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm shadow-md py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="DevClub Logo" 
              className="h-10 w-auto mr-2"
            />
            <span className="text-xl font-bold text-secondary-dark dark:text-primary">
              DevClub <span className="text-primary dark:text-white">Admin</span>
            </span>
          </Link>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link 
            to="/" 
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
          >
            Voltar para o site
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;