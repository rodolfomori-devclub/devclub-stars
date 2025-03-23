// src/components/admin/HonorForm.jsx
// Formulário para adicionar/editar alunos de honra ao mérito

import { useState, useEffect } from 'react';
import { addHighlight, updateHighlight, MERIT_TYPES, MERIT_NAMES } from '../../services/highlightService';
import Button from '../ui/Button';

const HonorForm = ({ highlight, isEditing, isOpen, onClose, onSuccess }) => {
  const initialState = {
    name: '',
    linkedinUrl: '',
    highlightDate: '',
    meritType: MERIT_TYPES.COMMUNITY_STAR,
    details: '',
    videoUrl: '',
    photoUrl: '',
    projectUrl: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (highlight && isEditing) {
      // Formata a data para o formato esperado pelo input date (YYYY-MM)
      const highlightDateFormatted = highlight.highlightDate 
        ? new Date(highlight.highlightDate).toISOString().slice(0, 7) 
        : '';
      
      setFormData({
        name: highlight.name || '',
        linkedinUrl: highlight.linkedinUrl || '',
        highlightDate: highlightDateFormatted,
        meritType: highlight.meritType || MERIT_TYPES.COMMUNITY_STAR,
        details: highlight.details || '',
        videoUrl: highlight.videoUrl || '',
        photoUrl: highlight.photoUrl || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [highlight, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validação de campos obrigatórios
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.highlightDate) {
      newErrors.highlightDate = 'Mês é obrigatório';
    }
    
    if (!formData.meritType) {
      newErrors.meritType = 'Tipo de mérito é obrigatório';
    }
    
    if (!formData.details.trim()) {
      newErrors.details = 'Detalhes são obrigatórios';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Converte a data do formato YYYY-MM para um objeto Date
      const highlightDateObj = new Date(`${formData.highlightDate}-01`);
      
      const dataToSave = {
        ...formData,
        highlightDate: highlightDateObj
      };
      
      if (isEditing && highlight?.id) {
        await updateHighlight(highlight.id, dataToSave);
      } else {
        await addHighlight(dataToSave);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar destaque:', error);
      alert('Ocorreu um erro ao salvar. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="w-full max-w-4xl bg-background-light dark:bg-background-dark rounded-lg shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {isEditing ? 'Editar Destaque' : 'Adicionar Novo Destaque'}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Nome*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.name 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label 
                  htmlFor="linkedinUrl" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  LinkedIn (opcional)
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
                />
              </div>

              {/* Mês de destaque */}
              <div>
                <label 
                  htmlFor="highlightDate" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Mês*
                </label>
                <input
                  type="month"
                  id="highlightDate"
                  name="highlightDate"
                  value={formData.highlightDate}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.highlightDate 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
                />
                {errors.highlightDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.highlightDate}</p>
                )}
              </div>

              {/* Tipo de mérito */}
              <div>
                <label 
                  htmlFor="meritType" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Tipo de Mérito*
                </label>
                <select
                  id="meritType"
                  name="meritType"
                  value={formData.meritType}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.meritType 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
                >
                  {Object.entries(MERIT_NAMES).map(([type, name]) => (
                    <option key={type} value={type}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.meritType && (
                  <p className="mt-1 text-sm text-red-500">{errors.meritType}</p>
                )}
              </div>

              {/* Link da foto */}
              <div>
                <label 
                  htmlFor="photoUrl" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Link da Foto (opcional)
                </label>
                <input
                  type="url"
                  id="photoUrl"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
                />
              </div>

              {/* Link do vídeo */}
              <div>
                <label 
                  htmlFor="videoUrl" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Link do Vídeo (opcional)
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/embed/id-do-video"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
                />
              </div>

              {/* Link do projeto */}
              <div>
                <label 
                  htmlFor="projectUrl" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Link do Projeto (opcional)
                </label>
                <input
                  type="url"
                  id="projectUrl"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/projeto"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
                />
              </div>
            </div>

            {/* Detalhes */}
            <div>
              <label 
                htmlFor="details" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Detalhes*
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 rounded-md border ${
                  errors.details 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
              ></textarea>
              {errors.details && (
                <p className="mt-1 text-sm text-red-500">{errors.details}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
                disabled={submitting}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
                className="cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  isEditing ? 'Atualizar' : 'Adicionar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HonorForm;