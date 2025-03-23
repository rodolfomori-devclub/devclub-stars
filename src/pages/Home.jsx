// src/pages/Home.jsx
// Página principal da aplicação DevClub Stars

import { useState, useEffect, useRef } from 'react';
import { getAllStudents, getRecentlyHiredStudents } from '../services/studentService';
import StudentCard from '../components/ui/StudentCard';
import Button from '../components/ui/Button';

const Home = () => {
  const [students, setStudents] = useState([]);
  const [recentlyHiredStudents, setRecentlyHiredStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(30);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    featured: false,
    all: false
  });

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuredRef = useRef(null);
  const allRef = useRef(null);

  // Carregar todos os alunos do Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os alunos
        const allStudents = await getAllStudents();
        setStudents(allStudents);
        
        // Buscar alunos destaque (contratados recentemente)
        const recentStudents = await getRecentlyHiredStudents();
        setRecentlyHiredStudents(recentStudents);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar os alunos com base no filtro atual e termo de busca
  useEffect(() => {
    if (students.length === 0) return;
    
    let result = [...students];
    
    // Aplicar filtro
    if (filter === 'with-video') {
      result = result.filter(student => student.videoUrl);
    } else if (filter === 'with-photo') {
      result = result.filter(student => student.photoUrl);
    } else if (filter === 'text-only') {
      result = result.filter(student => !student.photoUrl && !student.videoUrl);
    }
    
    // Aplicar termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name?.toLowerCase().includes(term) || 
          student.previousProfession?.toLowerCase().includes(term) ||
          student.journeyDetails?.toLowerCase().includes(term) ||
          student.firstJobDetails?.toLowerCase().includes(term) ||
          student.howDevClubHelped?.toLowerCase().includes(term)
      );
    }
    
    setFilteredStudents(result);
    // Resetar para a primeira página quando mudar o filtro ou a busca
    setCurrentPage(1);
  }, [filter, searchTerm, students]);

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
          } else if (entry.target === aboutRef.current) {
            setIsVisible(prev => ({ ...prev, about: true }));
          } else if (entry.target === featuredRef.current) {
            setIsVisible(prev => ({ ...prev, featured: true }));
          } else if (entry.target === allRef.current) {
            setIsVisible(prev => ({ ...prev, all: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (featuredRef.current) observer.observe(featuredRef.current);
    if (allRef.current) observer.observe(allRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (featuredRef.current) observer.unobserve(featuredRef.current);
      if (allRef.current) observer.unobserve(allRef.current);
    };
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`min-h-[90vh] flex items-center justify-center relative transition-opacity duration-1000 ${
          isVisible.hero ? 'opacity-100' : 'opacity-0'
        }`}
        id="hero"
      >
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-light dark:text-text-dark mb-6">
              <span className="text-primary">Transformando</span> vidas através da programação
            </h1>
            <p className="text-xl md:text-2xl text-text-muted-light dark:text-text-muted-dark mb-8">
              Conheça as histórias inspiradoras de quem mudou de carreira e encontrou sucesso na programação com o DevClub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="#destaques" size="lg">
                Ver Histórias de Sucesso
              </Button>
              <Button href="https://devclub.com" target="_blank" variant="outline" size="lg">
                Conheça o DevClub
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-xl"></div>
              <div className="relative bg-background-light dark:bg-background-dark rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {loading ? (
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    ))
                  ) : (
                    recentlyHiredStudents.slice(0, 4).map((student, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden">
                        {student.photoUrl ? (
                          <img 
                            src={student.photoUrl} 
                            alt={student.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
                            {student.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="bg-primary text-secondary p-4 text-center font-bold">
                  <p className="text-xl">+ de 15.000 alunos</p>
                  <p className="text-sm">transformando suas carreiras</p>
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

      {/* Sobre Section */}
      <section 
        ref={aboutRef}
        className={`py-20 bg-gray-50 dark:bg-secondary-dark/30 transition-all duration-1000 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="sobre"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              O <span className="text-primary">Mural da Fama</span> do DevClub
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto">
              Aqui celebramos as incríveis transformações de carreira dos nossos alunos. 
              De diferentes profissões para a programação de sucesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-background-light dark:bg-background-dark rounded-xl p-8 shadow-lg hover:shadow-neon transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark text-center mb-4">
                Histórias Reais
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-center">
                Todas as histórias compartilhadas aqui são de pessoas reais que transformaram suas vidas através da programação com o DevClub.
              </p>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-8 shadow-lg hover:shadow-neon transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark text-center mb-4">
                Transformação Rápida
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-center">
                Nossos alunos conseguem transições de carreira em tempo recorde, muitos em menos de 6 meses de estudo consistente.
              </p>
            </div>

            <div className="bg-background-light dark:bg-background-dark rounded-xl p-8 shadow-lg hover:shadow-neon transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark text-center mb-4">
                Aumento de Renda
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-center">
                A maioria dos nossos alunos relata um aumento significativo de renda após entrarem para o mercado de tecnologia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section 
        ref={featuredRef}
        className={`py-20 transition-all duration-1000 ${
          isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="destaques"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Alunos <span className="text-primary">Destaque</span>
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto">
              Conheça algumas das histórias mais inspiradoras dos nossos alunos que conseguiram emprego recentemente.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {recentlyHiredStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentlyHiredStudents.map((student) => (
                    <StudentCard key={student.id} student={student} />
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
                    Nenhum aluno destaque encontrado.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-12">
            <Button href="#historias" variant="primary" size="lg" className="dark:bg-secondary-light dark:hover:bg-secondary dark:text-white">
              Ver Todos os Alunos
            </Button>
          </div>
        </div>
      </section>

      {/* Todos os Alunos Section */}
      <section 
        ref={allRef}
        className={`py-20 bg-gray-50 dark:bg-secondary-dark/30 transition-all duration-1000 ${
          isVisible.all ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="historias"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Histórias de <span className="text-primary">Sucesso</span>
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto mb-8">
              Explore todas as incríveis trajetórias dos nossos alunos que transformaram suas vidas através da programação.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar alunos..."
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('with-video')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'with-video'
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Com Vídeo
              </button>
              <button
                onClick={() => setFilter('with-photo')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'with-photo'
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Com Foto
              </button>
              <button
                onClick={() => setFilter('text-only')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'text-only'
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Apenas Texto
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredStudents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStudents
                      .slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage)
                      .map((student) => (
                        <StudentCard key={student.id} student={student} />
                      ))}
                  </div>
                  
                  {/* Paginação */}
                  {filteredStudents.length > studentsPerPage && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-secondary-light hover:bg-secondary text-white cursor-pointer'
                          }`}
                        >
                          &laquo; Anterior
                        </button>
                        
                        <div className="flex items-center justify-center px-4 py-2 bg-primary text-secondary rounded-md">
                          Página {currentPage} de {Math.ceil(filteredStudents.length / studentsPerPage)}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => 
                            Math.min(prev + 1, Math.ceil(filteredStudents.length / studentsPerPage))
                          )}
                          disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === Math.ceil(filteredStudents.length / studentsPerPage)
                              ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-secondary-light hover:bg-secondary text-white cursor-pointer'
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
                    Nenhum aluno encontrado com esses critérios.
                  </p>
                  <Button
                    onClick={() => {
                      setFilter('all');
                      setSearchTerm('');
                    }}
                    variant="outline"
                    className="mt-4"
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
            Pronto para transformar <span className="text-primary">sua carreira</span>?
          </h2>
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl mx-auto mb-8">
            Junte-se a milhares de alunos que já mudaram suas vidas através da programação com o DevClub.
          </p>
          <Button 
            href="https://devclub.com" 
            target="_blank" 
            size="lg" 
            className="animate-glow"
          >
            Comece Sua Jornada Agora →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;