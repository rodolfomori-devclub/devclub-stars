// src/components/ui/StudentCard.jsx
import { useState } from 'react';
import VideoModal from './VideoModal';
import Button from './Button';

const StudentCard = ({ student }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    name, 
    photoUrl, 
    previousProfession, 
    journeyDetails, 
    videoUrl,
    firstJobThisMonth = false
  } = student;

  // Determina o tipo de card com base nas propriedades disponíveis
  const hasPhoto = !!photoUrl;
  const hasVideo = !!videoUrl;

  const handleOpenVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <div 
        className={`
          relative overflow-hidden rounded-lg transition-all duration-500
          ${firstJobThisMonth 
            ? 'md:col-span-2 shadow-neon-lg' 
            : 'border border-transparent hover:border-primary/30 shadow-lg hover:shadow-neon'}
          bg-background-light dark:bg-background-dark 
          h-full flex flex-col
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
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{name}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-2">
                  Antes: {previousProfession}
                </p>
                <div className="mt-auto">
                  {hasVideo && (
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
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{name}</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Antes: {previousProfession}
              </p>
              {hasVideo && (
                <Button 
                  onClick={handleOpenVideoModal} 
                  variant="outline" 
                  size="sm"
                  className="mt-4 animate-pulse-slow dark:border-primary dark:text-primary"
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
              )}
            </div>
          )}

          {/* Detalhes da jornada */}
          <div className={`
            prose prose-sm dark:prose-invert flex-grow 
            text-text-light dark:text-text-dark
          `}>
            <p className="whitespace-pre-line">{journeyDetails}</p>
          </div>

          {/* Indicador de rolagem quando houver mais conteúdo */}
          <div className="text-center mt-4 opacity-60 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="animate-bounce inline-block">↓ Mais detalhes ↓</span>
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
    </>
  );
};

export default StudentCard;