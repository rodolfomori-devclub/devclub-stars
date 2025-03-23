// src/components/admin/StudentForm.jsx
// Formulário para adicionar/editar alunos

import { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../../services/studentService';
import Button from '../ui/Button';

const StudentForm = ({ student, isEditing, isOpen, onClose, onSuccess }) => {
  const initialState = {
    name: '',
    hireDate: '',
    previousProfession: '',
    journeyDetails: '',
    firstJobDetails: '',
    howDevClubHelped: '',
    photoUrl: '',
    videoUrl: '',
    linkedinUrl: '',
    featured: false
  };

  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student && isEditing) {
      // Formata a data para o formato esperado pelo input date (YYYY-MM)
      const hireDateFormatted = student.hireDate 
        ? new Date(student.hireDate).toISOString().slice(0, 7) 
        : '';
      
      setFormData({
        name: student.name || '',
        hireDate: hireDateFormatted,
        previousProfession: student.previousProfession || '',
        journeyDetails: student.journeyDetails || '',
        firstJobDetails: student.firstJobDetails || '',
        howDevClubHelped: student.howDevClubHelped || '',
        photoUrl: student.photoUrl || '',
        videoUrl: student.videoUrl || '',
        featured: student.featured || false
      });
    } else {
      setFormData(initialState);
    }
  }, [student, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.hireDate) {
      newErrors.hireDate = 'Mês de contratação é obrigatório';
    }
    
    if (!formData.previousProfession.trim()) {
      newErrors.previousProfession = 'Antiga profissão é obrigatória';
    }
    
    if (!formData.journeyDetails.trim()) {
      newErrors.journeyDetails = 'História é obrigatória';
    }
    
    // Os campos firstJobDetails e howDevClubHelped são opcionais
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Converte a data do formato YYYY-MM para um objeto Date
      const hireDateObj = new Date(`${formData.hireDate}-01`);
      
      const dataToSave = {
        ...formData,
        hireDate: hireDateObj
      };
      
      if (isEditing && student?.id) {
        await updateStudent(student.id, dataToSave);
      } else {
        await addStudent(dataToSave);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
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
              {isEditing ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
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

              {/* Mês de contratação */}
              <div>
                <label 
                  htmlFor="hireDate" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Mês de Contratação*
                </label>
                <input
                  type="month"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.hireDate 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>
                )}
              </div>

              {/* Antiga Profissão */}
              <div>
                <label 
                  htmlFor="previousProfession" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Antiga Profissão*
                </label>
                <input
                  type="text"
                  id="previousProfession"
                  name="previousProfession"
                  value={formData.previousProfession}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border ${
                    errors.previousProfession 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
                />
                {errors.previousProfession && (
                  <p className="mt-1 text-sm text-red-500">{errors.previousProfession}</p>
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

              {/* Link do LinkedIn */}
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

              {/* Destaque */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label 
                  htmlFor="featured" 
                  className="ml-2 block text-sm text-text-light dark:text-text-dark"
                >
                  Marcar como destaque
                </label>
              </div>
            </div>

            {/* História */}
            <div>
              <label 
                htmlFor="journeyDetails" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                História*
              </label>
              <textarea
                id="journeyDetails"
                name="journeyDetails"
                value={formData.journeyDetails}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 rounded-md border ${
                  errors.journeyDetails 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark`}
              ></textarea>
              {errors.journeyDetails && (
                <p className="mt-1 text-sm text-red-500">{errors.journeyDetails}</p>
              )}
            </div>

            {/* Como conseguiu o primeiro emprego */}
            <div>
              <label 
                htmlFor="firstJobDetails" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Como fez para conseguir o primeiro emprego (opcional)
              </label>
              <textarea
                id="firstJobDetails"
                name="firstJobDetails"
                value={formData.firstJobDetails}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
              ></textarea>
            </div>

            {/* Como o DevClub ajudou */}
            <div>
              <label 
                htmlFor="howDevClubHelped" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Como o DevClub ajudou (opcional)
              </label>
              <textarea
                id="howDevClubHelped"
                name="howDevClubHelped"
                value={formData.howDevClubHelped}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-dark/30 text-text-light dark:text-text-dark"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
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

export default StudentForm;