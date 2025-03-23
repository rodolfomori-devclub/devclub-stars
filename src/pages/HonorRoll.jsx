// src/pages/HonorRoll.jsx
// Página Honra ao Mérito para exibir alunos destacados por conquistas

import { useState, useEffect, useRef } from 'react';
import { 
  getAllHighlights, 
  getRecentHighlights, 
  getHighlightsByType,
  MERIT_TYPES,
  MERIT_NAMES 
} from '../services/highlightService';
import HonorCard from '../components/ui/HonorCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Abacate from '../assets/abacate.png'

const HonorRoll = () => {
  const [highlights, setHighlights] = useState([]);
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [filteredHighlights, setFilteredHighlights] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightsPerPage] = useState(30);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    recent: false,
    all: false
  });

  const heroRef = useRef(null);
  const recentRef = useRef(null);
  const allRef = useRef(null);

  // Carregar todos os destaques do Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os destaques
        const allHighlights = await getAllHighlights();
        setHighlights(allHighlights);
        
        // Buscar destaques recentes (mês atual e anterior)
        const recent = await getRecentHighlights();
        setRecentHighlights(recent);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar os destaques com base no filtro atual e termo de busca
  useEffect(() => {
    if (highlights.length === 0) return;
    
    let result = [...highlights];
    
    // Aplicar filtro por tipo
    if (filter !== 'all') {
      result = result.filter(highlight => highlight.meritType === filter);
    }
    
    // Aplicar termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        highlight => 
          highlight.name?.toLowerCase().includes(term) || 
          highlight.details?.toLowerCase().includes(term)
      );
    }
    
    setFilteredHighlights(result);
    // Resetar para a primeira página quando mudar o filtro ou a busca
    setCurrentPage(1);
  }, [filter, searchTerm, highlights]);

  // Observar elementos para animações de entrada
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current) {
            setIsVisible(prev => ({ ...prev, hero: true }));
          } else if (entry.target === recentRef.current) {
            setIsVisible(prev => ({ ...prev, recent: true }));
          } else if (entry.target === allRef.current) {
            setIsVisible(prev => ({ ...prev, all: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (recentRef.current) observer.observe(recentRef.current);
    if (allRef.current) observer.observe(allRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (recentRef.current) observer.unobserve(recentRef.current);
      if (allRef.current) observer.unobserve(allRef.current);
    };
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`min-h-[70vh] flex items-center justify-center relative transition-opacity duration-1000 ${
          isVisible.hero ? 'opacity-100' : 'opacity-0'
        }`}
        id="hero"
      >
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-light dark:text-text-dark mb-6">
              <span className="text-primary">Honra</span> ao Mérito
            </h1>
            <p className="text-xl md:text-2xl text-text-muted-light dark:text-text-muted-dark mb-8">
              Celebrando as conquistas e realizações dos nossos alunos em diversas iniciativas do DevClub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="#destaques-recentes" size="lg">
                Ver Destaques Recentes
              </Button>
              <Button href="#todos-destaques" variant="outline" size="lg">
                Explorar Todos os Destaques
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="aspect-square bg-yellow-500 rounded-lg flex items-center justify-center p-6 text-white font-bold shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <div>Sócio do Mês</div>
                </div>
              </div>
              <div className="aspect-square bg-green-500 rounded-lg flex items-center justify-center p-6 text-white font-bold shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div>Freelancer Milionário</div>
                </div>
              </div>
              <div className="aspect-square bg-amber-500 rounded-lg flex items-center justify-center p-6 text-white font-bold shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div>Vencedor Baby Dev</div>
                </div>
              </div>
              <div className="aspect-square bg-green-300 rounded-lg flex items-center justify-center p-6 text-secondary font-bold shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">🥑</div>
                  <div>Vencedor Abacatão</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seta de scroll */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-primary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </section>

      {/* Destaques Recentes Section */}
      <section 
        ref={recentRef}
        className={`py-20 bg-gray-50 dark:bg-secondary-dark/30 transition-all duration-1000 ${
          isVisible.recent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="destaques-recentes"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Destaques <span className="text-primary">Recentes</span>
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto">
              Conheça os alunos que se destacaram no mês atual e anterior em diferentes categorias.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {recentHighlights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentHighlights.map((highlight) => (
                    <HonorCard key={highlight.id} highlight={highlight} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-4 text-xl text-text-muted-light dark:text-text-muted-dark">
                    Nenhum destaque recente encontrado.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Todos os Destaques Section */}
      <section 
        ref={allRef}
        className={`py-20 transition-all duration-1000 ${
          isVisible.all ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="todos-destaques"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Todos os <span className="text-primary">Destaques</span>
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto mb-8">
              Explore todos os destaques e conquistas dos nossos alunos ao longo do tempo.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar destaques..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter(MERIT_TYPES.COMMUNITY_STAR)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filter === MERIT_TYPES.COMMUNITY_STAR
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Sócio do Mês
              </button>
              <button
                onClick={() => setFilter(MERIT_TYPES.FREELANCER)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filter === MERIT_TYPES.FREELANCER
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Freelancer Milionário
              </button>
              <button
                onClick={() => setFilter(MERIT_TYPES.BABY_DEV)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filter === MERIT_TYPES.BABY_DEV
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Vencedor Baby Dev
              </button>
              <button
                onClick={() => setFilter(MERIT_TYPES.ABACATAO)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  filter === MERIT_TYPES.ABACATAO
                    ? 'bg-green-300 text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Vencedor Abacatão
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {filteredHighlights.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHighlights
                      .slice((currentPage - 1) * highlightsPerPage, currentPage * highlightsPerPage)
                      .map((highlight) => (
                        <HonorCard key={highlight.id} highlight={highlight} />
                      ))}
                  </div>
                  
                  {/* Paginação */}
                  {filteredHighlights.length > highlightsPerPage && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-md cursor-pointer ${
                            currentPage === 1
                              ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-secondary-light hover:bg-secondary text-white'
                          }`}
                        >
                          &laquo; Anterior
                        </button>
                        
                        <div className="flex items-center justify-center px-4 py-2 bg-primary text-secondary rounded-md">
                          Página {currentPage} de {Math.ceil(filteredHighlights.length / highlightsPerPage)}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => 
                            Math.min(prev + 1, Math.ceil(filteredHighlights.length / highlightsPerPage))
                          )}
                          disabled={currentPage === Math.ceil(filteredHighlights.length / highlightsPerPage)}
                          className={`px-4 py-2 rounded-md cursor-pointer ${
                            currentPage === Math.ceil(filteredHighlights.length / highlightsPerPage)
                              ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-secondary-light hover:bg-secondary text-white'
                          }`}
                        >
                          Próxima &raquo;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-4 text-xl text-text-muted-light dark:text-text-muted-dark">
                    Nenhum destaque encontrado com esses critérios.
                  </p>
                  <Button
                    onClick={() => {
                      setFilter('all');
                      setSearchTerm('');
                    }}
                    variant="outline"
                    className="mt-4 cursor-pointer"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10 dark:bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            Quer fazer parte do <span className="text-primary">Mural de Honra</span>?
          </h2>
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto mb-8">
            Participe das iniciativas do DevClub, destaque-se na comunidade, e você pode ser o próximo a entrar no nosso Mural de Honra ao Mérito!
          </p>
          <Button 
            href="https://devclub.com" 
            target="_blank" 
            size="lg" 
            className="animate-glow cursor-pointer"
          >
            Conhecer Iniciativas →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HonorRoll;