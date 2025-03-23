// src/components/ui/HonorCard.jsx
// Componente de card para exibir informações de alunos honrados

import { useState } from 'react';
import { MERIT_TYPES, MERIT_NAMES, MERIT_COLORS } from '../../services/highlightService';
import VideoModal from './VideoModal';
import { formatHireDate } from '../../utils/dateUtils';

const HonorCard = ({ highlight }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    name, 
    photoUrl, 
    linkedinUrl,
    meritType,
    details,
    videoUrl,
    projectUrl,
    highlightDate
  } = highlight;

  // Determina o tipo de card com base nas propriedades disponíveis
  const hasPhoto = !!photoUrl;
  const hasVideo = !!videoUrl;

  // Define a cor de fundo com base no tipo de mérito
  const bgColorClass = MERIT_COLORS[meritType] || 'bg-gray-500';
  
  // Define o ícone com base no tipo de mérito
  const renderMeritIcon = () => {
    switch(meritType) {
      case MERIT_TYPES.COMMUNITY_STAR:
        return <span className="text-4xl">⭐</span>;
      case MERIT_TYPES.FREELANCER:
        return <span className="text-4xl">💰</span>;
      case MERIT_TYPES.BABY_DEV:
        return <span className="text-4xl">🏆</span>;
      case MERIT_TYPES.ABACATAO:
        return <span className="text-4xl">🥑</span>;
      default:
        return <span className="text-4xl">🏅</span>;
    }
  };

  const handleOpenVideoModal = () => {
    if (hasVideo) {
      setIsVideoModalOpen(true);
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <div 
        className={`
          relative overflow-hidden rounded-lg transition-all duration-500
          border border-transparent hover:border-primary/30 shadow-lg hover:shadow-xl
          h-full flex flex-col cursor-pointer
          ${bgColorClass} text-white
          ${meritType === MERIT_TYPES.ABACATAO ? 'text-secondary' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge do tipo de mérito */}
        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-bold text-sm z-10 bg-black/30">
          {MERIT_NAMES[meritType] || "Destaque"}
        </div>

        <div className="flex flex-col h-full p-6">
          {/* Header com foto/ícone e informações */}
          <div className="flex gap-4 mb-6">
            {/* Foto ou ícone */}
            <div className="flex-shrink-0">
              {hasPhoto ? (
                <div className={`
                  relative w-20 h-20 rounded-full overflow-hidden 
                  border-4 border-white/40 
                  ${isHovered ? 'animate-pulse-slow' : ''}
                `}>
                  <img 
                    src={photoUrl} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`
                  relative w-20 h-20 rounded-full overflow-hidden 
                  border-4 border-white/40 flex items-center justify-center
                  ${isHovered ? 'animate-pulse-slow' : ''}
                  bg-white/20
                `}>
                  {renderMeritIcon()}
                </div>
              )}
            </div>
            
            {/* Informações */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center">
                <h3 className="text-xl font-bold">{name}</h3>
                {linkedinUrl && (
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-white hover:text-blue-200 transition-colors cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
              <p className="opacity-90 text-sm">
                {formatHireDate(highlightDate)}
              </p>
            </div>
          </div>

          {/* Detalhes */}
          <div className="mb-4 flex-grow">
            <p className="whitespace-pre-line">{details}</p>
          </div>

          {/* Botões de ações */}
          <div className="mt-auto flex flex-wrap gap-2">
            {videoUrl && (
              <button
                onClick={handleOpenVideoModal}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full text-sm font-medium cursor-pointer"
              >
                <div className="flex items-center">
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
                  Assistir Vídeo
                </div>
              </button>
            )}
            
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-full text-sm font-medium cursor-pointer"
              >
                <div className="flex items-center">
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                  Veja o Projeto
                </div>
              </a>
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
    </>
  );
};

export default HonorCard;