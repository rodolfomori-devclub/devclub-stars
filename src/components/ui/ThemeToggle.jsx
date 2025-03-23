// src/components/ui/ThemeToggle.jsx
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center p-1 h-8 w-16 rounded-full bg-secondary-light dark:bg-secondary-dark transition-colors duration-300 focus:outline-none"
      aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {/* Círculo que se move */}
      <span 
        className={`
          flex items-center justify-center h-6 w-6 rounded-full bg-primary
          transform transition-transform duration-300 ease-in-out
          ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          // Ícone da lua (modo escuro)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-4 h-4 text-secondary-dark"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        ) : (
          // Ícone do sol (modo claro)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-4 h-4 text-secondary-dark"
          >
            <circle cx="12" cy="12" r="5" strokeWidth={2} />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" 
            />
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;