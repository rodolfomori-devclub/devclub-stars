// src/services/csvService.js
import Papa from 'papaparse';

/**
 * Carrega e processa o arquivo CSV de alunos
 * @returns {Promise<Array>} Array de objetos com os dados dos alunos
 */
export const loadStudentsFromCSV = async () => {
  try {
    // Carregar o arquivo CSV usando fetch
    const response = await fetch('/database.csv');
    const csvText = await response.text();
    
    // Parsear o CSV para JSON
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Limpar os cabeçalhos de espaços e caracteres especiais
        return header.trim();
      }
    });
    
    // Verifica se temos dados
    if (!data || data.length === 0) {
      console.error('Nenhum dado encontrado no CSV');
      return [];
    }
    
    // Obter o mês atual e o mês anterior para filtrar os alunos empregados recentemente
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = currentDate.getFullYear();
    const previousYear = previousMonth === 12 ? currentYear - 1 : currentYear;
    
    // Processar os dados para o formato necessário
    return data.map((row, index) => {
      // Extrair o mês de contratação
      const contractMonth = processMonthOfContract(row['MESDECONTRATACAO'] || row['MES DE CONTRATACAO']);
      
      // Verificar se o aluno foi contratado no mês atual ou anterior
      const isRecentlyHired = isRecentContract(contractMonth, currentMonth, previousMonth, currentYear, previousYear);
      
      // Verificar se tem depoimento em vídeo
      const hasVideo = (row['DEPOIMENTOGRAVADO?'] || row['DEPOIMENTO GRAVADO?'] || '').toUpperCase().includes('SIM');
      
      return {
        id: index + 1,
        name: row['NOME'] || '',
        previousProfession: row['ANTIGAPROFISSAO'] || row['ANTIGA PROFISSAO'] || '',
        history: row['HISTÓRIA'] || '',
        hiringProcess: row['PROCESSOPARACONSEGUIREMPREGO'] || row['PROCESSO PARA CONSEGUIR EMPREGO'] || '',
        devClubHelp: row['ComoDevClubajudou?'] || row['Como o DevClub ajudou?'] || '',
        journeyDetails: composeJourneyDetails(
          row['HISTÓRIA'] || '',
          row['PROCESSOPARACONSEGUIREMPREGO'] || row['PROCESSO PARA CONSEGUIR EMPREGO'] || '',
          row['ComoDevClubajudou?'] || row['Como o DevClub ajudou?'] || ''
        ),
        photoUrl: row['Foto'] || '',
        videoUrl: hasVideo ? (row['LINKDEPOIMENTO'] || row['LINK DEPOIMENTO'] || '') : '',
        contractMonth: contractMonth,
        firstJobThisMonth: isRecentlyHired
      };
    });
  } catch (error) {
    console.error('Erro ao carregar os dados do CSV:', error);
    return [];
  }
};

/**
 * Compõe os detalhes da jornada combinando os diferentes campos
 */
function composeJourneyDetails(history, hiringProcess, devClubHelp) {
  const sections = [];
  
  if (history) {
    sections.push(history);
  }
  
  if (hiringProcess) {
    sections.push(hiringProcess);
  }
  
  if (devClubHelp) {
    sections.push(`Como o DevClub ajudou: ${devClubHelp}`);
  }
  
  return sections.join('\n\n');
}

/**
 * Processa o mês de contratação do formato do CSV
 */
function processMonthOfContract(monthStr) {
  if (!monthStr) return null;
  
  // Normaliza a string do mês
  const normalized = monthStr.trim().toLowerCase();
  
  // Mapeamento de nomes de meses para números
  const monthMap = {
    'janeiro': 1, 'jan': 1, '01': 1, '1': 1,
    'fevereiro': 2, 'fev': 2, '02': 2, '2': 2,
    'março': 3, 'mar': 3, '03': 3, '3': 3,
    'abril': 4, 'abr': 4, '04': 4, '4': 4,
    'maio': 5, 'mai': 5, '05': 5, '5': 5,
    'junho': 6, 'jun': 6, '06': 6, '6': 6,
    'julho': 7, 'jul': 7, '07': 7, '7': 7,
    'agosto': 8, 'ago': 8, '08': 8, '8': 8, 
    'setembro': 9, 'set': 9, '09': 9, '9': 9,
    'outubro': 10, 'out': 10, '10': 10,
    'novembro': 11, 'nov': 11, '11': 11,
    'dezembro': 12, 'dez': 12, '12': 12
  };
  
  // Tenta encontrar o mês pelo nome
  for (const [key, value] of Object.entries(monthMap)) {
    if (normalized.includes(key)) {
      return { month: value, year: new Date().getFullYear() };
    }
  }
  
  // Tenta extrair data no formato MM/AAAA ou MM-AAAA
  const dateMatch = normalized.match(/(\d{1,2})[\/\-](\d{4})/);
  if (dateMatch) {
    return { 
      month: parseInt(dateMatch[1]), 
      year: parseInt(dateMatch[2])
    };
  }
  
  // Tenta extrair apenas o número do mês
  const monthNumber = parseInt(normalized);
  if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
    return { month: monthNumber, year: new Date().getFullYear() };
  }
  
  return null;
}

/**
 * Verifica se o contrato é do mês atual ou anterior
 */
function isRecentContract(contractDate, currentMonth, previousMonth, currentYear, previousYear) {
  if (!contractDate) return false;
  
  const { month, year } = contractDate;
  
  // No mês atual do ano atual
  if (month === currentMonth && year === currentYear) {
    return true;
  }
  
  // No mês anterior
  if (month === previousMonth) {
    // Se for dezembro do ano anterior
    if (previousMonth === 12 && year === previousYear) {
      return true;
    }
    // Ou se for qualquer outro mês do ano atual
    if (year === currentYear) {
      return true;
    }
  }
  
  return false;
}