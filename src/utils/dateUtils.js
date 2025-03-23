// src/utils/dateUtils.js
// Utilitários para manipulação de datas

/**
 * Formata uma data para exibição no formato "Mês de Ano"
 * @param {Date|string|number} date - Data para formatar 
 * @returns {string} Data formatada (ex: "Março de 2025")
 */
export const formatHireDate = (date) => {
  if (!date) return 'Não informado';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Verifica se uma data é do mês atual ou do mês anterior
 * @param {Date|string|number} date - Data para verificar
 * @returns {boolean} Verdadeiro se a data for do mês atual ou anterior
 */
export const isRecentDate = (date) => {
  if (!date) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  
  // Verifica se é o mês atual
  if (month === currentMonth && year === currentYear) {
    return true;
  }
  
  // Verifica se é o mês anterior
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  return month === previousMonth && year === previousYear;
};