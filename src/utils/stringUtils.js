// src/utils/stringUtils.js
// Utilitários para manipulação de strings

/**
 * Capitaliza a primeira letra de cada palavra em uma string
 * @param {string} str - String para capitalizar
 * @returns {string} String com a primeira letra de cada palavra em maiúsculo
 */
export const capitalizeWords = (str) => {
    if (!str) return '';
    
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };