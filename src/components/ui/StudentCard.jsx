// src/components/ui/StudentCard.jsx
// Componente de card para exibir informações do aluno

import { useState } from 'react';
import VideoModal from './VideoModal';
import Button from './Button';

const StudentCard = ({ student }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullJourneyDetails, setShowFullJourneyDetails] = useState(false);
  const [showFullFirstJobDetails, setShowFullFirstJobDetails] = useState(false);
  const [showFullDevClubHelped, setShowFullDevClubHelped] = useState(false);
  
  const { 
    name, 
    photoUrl, 
    previousProfession, 
    journeyDetails, 
    firstJobDetails,
    howDevClubHelped,
    videoUrl,
    linkedinUrl,
    hireDate
  } = student;

  // Verifica se o mês de contratação é o atual ou o anterior
  const isRecentlyHired = () => {
    if (!hireDate) return false;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const hireMonth = new Date(hireDate).getMonth();
    const hireYear = new Date(hireDate).getFullYear();
    
    // Mês atual
    if (hireMonth === currentMonth && hireYear === currentYear) {
      return true;
    }
    
    // Mês anterior
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    return hireMonth === previousMonth && hireYear === previousYear;
  };

  // Determina o tipo de card com base nas propriedades disponíveis
  const hasPhoto = !!photoUrl;
  const hasVideo = !!videoUrl;
  const firstJobThisMonth = isRecentlyHired();

  const handleOpenVideoModal = () => {
    if (hasVideo) {
      setIsVideoModalOpen(true);
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };
  
  // Função para truncar texto longo (aproximadamente 4 linhas)
  const truncateText = (text, maxLength = 230) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderVideoButton = () => {
    if (hasVideo) {
      return (
        <Button 
          onClick={handleOpenVideoModal} 
          variant="outline" 
          size="sm"
          className="mt-2 animate-pulse-slow dark:border-primary dark:text-primary"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5 mr-2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Assistir História
        </Button>
      );
    } else {
      return (
        <Button 
          variant="outline" 
          size="sm"
          disabled
          className="mt-2 opacity-50 cursor-not-allowed"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5 mr-2 text-gray-400"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Assistir História
        </Button>
      );
    }
  };

  const renderName = () => (
    <div className="flex items-center">
      <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{name}</h3>
      {linkedinUrl && (
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      )}
    </div>
  );

  return (
    <div>
      <div 
        className={`
          relative overflow-hidden rounded-lg transition-all duration-500
          ${firstJobThisMonth 
            ? 'md:col-span-2 shadow-neon-lg' 
            : 'border border-transparent hover:border-primary/30 shadow-lg hover:shadow-neon'}
          bg-background-light dark:bg-background-dark 
          h-full flex flex-col cursor-pointer
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Efeito especial para alunos que conseguiram o primeiro emprego este mês */}
        {firstJobThisMonth && (
          <div className="absolute top-0 right-0 bg-primary text-secondary px-3 py-1 rounded-bl-lg font-bold text-sm z-10">
            NOVO EMPREGO
          </div>
        )}

        <div className="flex flex-col h-full p-6">
          {/* Layout diferente baseado no conteúdo disponível */}
          {hasPhoto ? (
            <div className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="flex-shrink-0">
                <div className={`
                  relative w-32 h-32 rounded-full overflow-hidden 
                  border-4 border-primary/40 
                  ${isHovered ? 'animate-pulse-slow shadow-neon' : ''}
                `}>
                  <img 
                    src={photoUrl} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {renderName()}
                <p className="text-text-muted-light dark:text-text-muted-dark mb-2">
                  Antes: {previousProfession}
                </p>
                <div className="mt-auto">
                  {renderVideoButton()}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              {renderName()}
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Antes: {previousProfession}
              </p>
              <div className="mt-2">
                {renderVideoButton()}
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-4">
            {/* História - sempre visível */}
            <div className="py-3">
              <h4 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                História
              </h4>
              <div className="whitespace-pre-line text-text-light dark:text-text-dark">
                {journeyDetails && journeyDetails.length > 230 && !showFullJourneyDetails ? (
                  <>
                    <p>{truncateText(journeyDetails)}</p>
                    <button 
                      onClick={() => setShowFullJourneyDetails(true)}
                      className="mt-2 text-primary hover:text-primary-dark text-sm font-medium cursor-pointer"
                    >
                      Ver tudo
                    </button>
                  </>
                ) : (
                  <p>{journeyDetails}</p>
                )}
              </div>
            </div>

            {/* Como conseguiu o primeiro emprego - se existir */}
            {firstJobDetails && (
              <div className="py-3">
                <h4 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                  Como conseguiu o primeiro emprego
                </h4>
                <div className="whitespace-pre-line text-text-light dark:text-text-dark">
                  {firstJobDetails.length > 230 && !showFullFirstJobDetails ? (
                    <>
                      <p>{truncateText(firstJobDetails)}</p>
                      <button 
                        onClick={() => setShowFullFirstJobDetails(true)}
                        className="mt-2 text-primary hover:text-primary-dark text-sm font-medium cursor-pointer"
                      >
                        Ver tudo
                      </button>
                    </>
                  ) : (
                    <p>{firstJobDetails}</p>
                  )}
                </div>
              </div>
            )}

            {/* Como o DevClub ajudou - se existir */}
            {howDevClubHelped && (
              <div className="py-3">
                <h4 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                  Como o DevClub ajudou
                </h4>
                <div className="whitespace-pre-line text-text-light dark:text-text-dark">
                  {howDevClubHelped.length > 230 && !showFullDevClubHelped ? (
                    <>
                      <p>{truncateText(howDevClubHelped)}</p>
                      <button 
                        onClick={() => setShowFullDevClubHelped(true)}
                        className="mt-2 text-primary hover:text-primary-dark text-sm font-medium cursor-pointer"
                      >
                        Ver tudo
                      </button>
                    </>
                  ) : (
                    <p>{howDevClubHelped}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de vídeo */}
      {hasVideo && (
        <VideoModal 
          isOpen={isVideoModalOpen} 
          videoUrl={videoUrl} 
          onClose={handleCloseVideoModal}
        />
      )}
    </div>
  );
};

export default StudentCard;