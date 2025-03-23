// src/components/layout/Header.jsx
// Cabeçalho principal da aplicação

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import Button from '../ui/Button'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Detecta o scroll para alterar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? 'py-2 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm shadow-md'
            : 'py-4 bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo e botões de navegação principais sempre visíveis */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="DevClub Logo"
              className="h-8 w-auto mr-1 md:h-10 md:mr-2"
            />
            <span className="text-sm md:text-xl font-bold text-secondary-dark dark:text-primary">
              DevClub{' '}
              <span className="text-primary dark:text-white">Stars</span>
            </span>
          </Link>
          <div className="flex items-center space-x-1 md:space-x-4 ml-1 md:ml-4">
            <Button variant="outline" className="cursor-pointer text-xs md:text-base px-2 py-1 md:px-4 md:py-2">
              <Link
                to="/"
                className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              >
                Destaques
              </Link>
            </Button>
            <Button className="cursor-pointer text-xs md:text-base px-2 py-0 md:px-4 md:py-2">
              <Link
                to="/honra-ao-merito"
                className="text-text-light hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              >
                Honra ao Mérito
              </Link>
            </Button>
          </div>
        </div>

        {/* Menu de navegação (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4 ml-4">
            <ThemeToggle />
            <Link
              to="https://go.rodolfomori.com.br/suporte"
              target="_blank"
              className="cursor-pointer"
            >
              Entrar no DevClub
            </Link>
          </div>
        </nav>    
      </div>


    </header>
  )
}

export default Header