// src/components/admin/HonorModal.jsx
// Modal para visualização detalhada de um aluno de honra ao mérito

import Button from '../ui/Button';
import { MERIT_NAMES } from '../../services/highlightService';
import { formatHireDate } from '../../utils/dateUtils';

const HonorModal = ({ highlight, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !highlight) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="w-full max-w-4xl bg-background-light dark:bg-background-dark rounded-lg shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
              Detalhes do Destaque
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Coluna 1: Informações básicas */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Informações Básicas
                </h3>
                <div className="space-y-2">
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Nome:</span> {highlight.name}
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Tipo de Mérito:</span> {MERIT_NAMES[highlight.meritType] || "Destaque"}
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Mês de Destaque:</span> {formatHireDate(highlight.highlightDate)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Mídia e Contato
                </h3>
                <div className="space-y-2">
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Foto:</span> {
                      highlight.photoUrl ? (
                        <a 
                          href={highlight.photoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline cursor-pointer"
                        >
                          Ver foto
                        </a>
                      ) : 'Não informada'
                    }
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Vídeo:</span> {
                      highlight.videoUrl ? (
                        <a 
                          href={highlight.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline cursor-pointer"
                        >
                          Ver vídeo
                        </a>
                      ) : 'Não informado'
                    }
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">LinkedIn:</span> {
                      highlight.linkedinUrl ? (
                        <a 
                          href={highlight.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline cursor-pointer"
                        >
                          Ver perfil
                        </a>
                      ) : 'Não informado'
                    }
                  </p>
                  <p className="text-text-light dark:text-text-dark">
                    <span className="font-medium">Projeto:</span> {
                      highlight.projectUrl ? (
                        <a 
                          href={highlight.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline cursor-pointer"
                        >
                          Ver projeto
                        </a>
                      ) : 'Não informado'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna 2-3: Detalhes do destaque */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Detalhes
                </h3>
                <p className="text-text-light dark:text-text-dark whitespace-pre-line">
                  {highlight.details || 'Não informados'}
                </p>
              </div>
            </div>
          </div>

          {/* Visualização de foto (se existir) */}
          {highlight.photoUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Prévia da Foto
              </h3>
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/40">
                <img 
                  src={highlight.photoUrl} 
                  alt={highlight.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onDelete}
              type="button"
              className="cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              Excluir
            </Button>
            <Button 
              variant="primary" 
              onClick={onEdit}
              type="button"
              className="cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HonorModal;