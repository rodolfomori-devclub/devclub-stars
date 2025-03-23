// src/pages/Admin.jsx
// Página de administração para gerenciar alunos e destaques

import { useState, useEffect } from 'react';
import { 
  getAllStudents, 
  deleteStudent 
} from '../services/studentService';
import {
  getAllHighlights,
  deleteHighlight,
  MERIT_NAMES
} from '../services/highlightService';
import Button from '../components/ui/Button';
import AdminHeader from '../components/admin/AdminHeader';
import StudentForm from '../components/admin/StudentForm';
import StudentModal from '../components/admin/StudentModal';
import HonorForm from '../components/admin/HonorForm';
import HonorModal from '../components/admin/HonorModal';
import { formatHireDate } from '../utils/dateUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Admin = () => {
  // Estado para alunos empregados
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isStudentFormModalOpen, setIsStudentFormModalOpen] = useState(false);
  const [isStudentViewModalOpen, setIsStudentViewModalOpen] = useState(false);
  const [isStudentEditing, setIsStudentEditing] = useState(false);
  
  // Estado para alunos de honra ao mérito
  const [highlights, setHighlights] = useState([]);
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [isHighlightFormModalOpen, setIsHighlightFormModalOpen] = useState(false);
  const [isHighlightViewModalOpen, setIsHighlightViewModalOpen] = useState(false);
  const [isHighlightEditing, setIsHighlightEditing] = useState(false);
  
  // Estado para controle da UI
  const [activeTab, setActiveTab] = useState('students'); // 'students' ou 'honors'
  const [loading, setLoading] = useState(true);

  // Carrega dados
  useEffect(() => {
    loadData();
  }, []);

  // Função para carregar todos os dados
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carrega alunos empregados
      const studentsData = await getAllStudents();
      setStudents(studentsData);
      
      // Carrega alunos de honra ao mérito
      const highlightsData = await getAllHighlights();
      setHighlights(highlightsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Funções para gerenciar alunos empregados
  const handleAddStudent = () => {
    setCurrentStudent(null);
    setIsStudentEditing(false);
    setIsStudentFormModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setCurrentStudent(student);
    setIsStudentViewModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsStudentEditing(true);
    setIsStudentFormModalOpen(true);
    setIsStudentViewModalOpen(false);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteStudent(id);
        loadData();
        setIsStudentViewModalOpen(false);
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
      }
    }
  };

  const handleStudentFormSuccess = () => {
    setIsStudentFormModalOpen(false);
    loadData();
  };

  // Funções para gerenciar alunos de honra ao mérito
  const handleAddHighlight = () => {
    setCurrentHighlight(null);
    setIsHighlightEditing(false);
    setIsHighlightFormModalOpen(true);
  };

  const handleViewHighlight = (highlight) => {
    setCurrentHighlight(highlight);
    setIsHighlightViewModalOpen(true);
  };

  const handleEditHighlight = (highlight) => {
    setCurrentHighlight(highlight);
    setIsHighlightEditing(true);
    setIsHighlightFormModalOpen(true);
    setIsHighlightViewModalOpen(false);
  };

  const handleDeleteHighlight = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este destaque?')) {
      try {
        await deleteHighlight(id);
        loadData();
        setIsHighlightViewModalOpen(false);
      } catch (error) {
        console.error('Erro ao excluir destaque:', error);
      }
    }
  };

  const handleHighlightFormSuccess = () => {
    setIsHighlightFormModalOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <AdminHeader />
      
      <main className="container mx-auto p-4 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="flex space-x-3">
            {activeTab === 'students' && (
              <Button onClick={handleAddStudent} className="cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Adicionar Aluno Empregado
              </Button>
            )}
            
            {activeTab === 'honors' && (
              <Button onClick={handleAddHighlight} className="cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Adicionar Honra ao Mérito
              </Button>
            )}
          </div>
        </div>

        {/* Abas para alternar entre Alunos e Honras ao Mérito */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium cursor-pointer transition-colors ${
              activeTab === 'students'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted-light dark:text-text-muted-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Alunos Empregados
          </button>
          <button
            className={`py-2 px-4 font-medium cursor-pointer transition-colors ${
              activeTab === 'honors'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted-light dark:text-text-muted-dark hover:text-primary'
            }`}
            onClick={() => setActiveTab('honors')}
          >
            Honra ao Mérito
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Tabela de Alunos Empregados */}
            {activeTab === 'students' && (
              <div className="bg-white dark:bg-background-dark rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-secondary-dark/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Antiga Profissão
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mês de Contratação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Destaque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mídias
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr 
                          key={student.id} 
                          className="hover:bg-gray-50 dark:hover:bg-secondary-dark/10 cursor-pointer"
                          onClick={() => handleViewStudent(student)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-text-light dark:text-text-dark">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-text-muted-light dark:text-text-muted-dark">
                              {student.previousProfession}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-text-muted-light dark:text-text-muted-dark">
                              {formatHireDate(student.hireDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.featured ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                Sim
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                Não
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {student.photoUrl && (
                                <span className="text-primary">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                    />
                                  </svg>
                                </span>
                              )}
                              {student.videoUrl && (
                                <span className="text-primary">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                                    />
                                  </svg>
                                </span>
                              )}
                              {student.linkedinUrl && (
                                <span className="text-blue-600">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          Nenhum aluno cadastrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tabela de Honras ao Mérito */}
            {activeTab === 'honors' && (
              <div className="bg-white dark:bg-background-dark rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-secondary-dark/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Mérito
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mês
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mídias
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
                    {highlights.length > 0 ? (
                      highlights.map((highlight) => (
                        <tr 
                          key={highlight.id} 
                          className="hover:bg-gray-50 dark:hover:bg-secondary-dark/10 cursor-pointer"
                          onClick={() => handleViewHighlight(highlight)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-text-light dark:text-text-dark">
                              {highlight.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-text-muted-light dark:text-text-muted-dark">
                              {MERIT_NAMES[highlight.meritType] || "Destaque"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-text-muted-light dark:text-text-muted-dark">
                              {formatHireDate(highlight.highlightDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {highlight.photoUrl && (
                                <span className="text-primary">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                    />
                                  </svg>
                                </span>
                              )}
                              {highlight.videoUrl && (
                                <span className="text-primary">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                                    />
                                  </svg>
                                </span>
                              )}
                              {highlight.linkedinUrl && (
                                <span className="text-blue-600">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          Nenhum destaque cadastrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal para adicionar/editar aluno */}
      {isStudentFormModalOpen && (
        <StudentForm 
          student={currentStudent}
          isEditing={isStudentEditing}
          isOpen={isStudentFormModalOpen}
          onClose={() => setIsStudentFormModalOpen(false)}
          onSuccess={handleStudentFormSuccess}
        />
      )}

      {/* Modal para visualizar detalhes do aluno */}
      {isStudentViewModalOpen && currentStudent && (
        <StudentModal 
          student={currentStudent}
          isOpen={isStudentViewModalOpen}
          onClose={() => setIsStudentViewModalOpen(false)}
          onEdit={() => handleEditStudent(currentStudent)}
          onDelete={() => handleDeleteStudent(currentStudent.id)}
        />
      )}

      {/* Modal para adicionar/editar destaque */}
      {isHighlightFormModalOpen && (
        <HonorForm 
          highlight={currentHighlight}
          isEditing={isHighlightEditing}
          isOpen={isHighlightFormModalOpen}
          onClose={() => setIsHighlightFormModalOpen(false)}
          onSuccess={handleHighlightFormSuccess}
        />
      )}

      {/* Modal para visualizar detalhes do destaque */}
      {isHighlightViewModalOpen && currentHighlight && (
        <HonorModal 
          highlight={currentHighlight}
          isOpen={isHighlightViewModalOpen}
          onClose={() => setIsHighlightViewModalOpen(false)}
          onEdit={() => handleEditHighlight(currentHighlight)}
          onDelete={() => handleDeleteHighlight(currentHighlight.id)}
        />
      )}
    </div>
  );
};

export default Admin;