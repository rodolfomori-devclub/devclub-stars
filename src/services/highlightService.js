// src/services/highlightService.js
// Serviços para gerenciar os dados dos alunos destacados (Honra ao Mérito) no Firebase

import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const highlightsCollection = 'highlights';

// Função para embaralhar arrays (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Tipos de mérito
export const MERIT_TYPES = {
  COMMUNITY_STAR: 'community_star',
  FREELANCER: 'freelancer',
  BABY_DEV: 'baby_dev',
  ABACATAO: 'abacatao'
};

// Nomes amigáveis para os tipos de mérito
export const MERIT_NAMES = {
  [MERIT_TYPES.COMMUNITY_STAR]: 'Sócio do Mês',
  [MERIT_TYPES.FREELANCER]: 'Freelancer Milionário',
  [MERIT_TYPES.BABY_DEV]: 'Vencedor Baby Dev',
  [MERIT_TYPES.ABACATAO]: 'Vencedor Abacatão'
};

// Cores para os tipos de mérito
export const MERIT_COLORS = {
  [MERIT_TYPES.COMMUNITY_STAR]: 'bg-yellow-500', // Dourado
  [MERIT_TYPES.FREELANCER]: 'bg-green-500',      // Verde
  [MERIT_TYPES.BABY_DEV]: 'bg-amber-500',        // Laranja esverdeado
  [MERIT_TYPES.ABACATAO]: 'bg-green-300'         // Verde claro
};

// Busca todos os destaques
export const getAllHighlights = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, highlightsCollection), orderBy('highlightDate', 'desc'), orderBy('name'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      highlightDate: doc.data().highlightDate?.toDate() // Converte Timestamp para Date
    }));
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    throw error;
  }
};

// Busca destaques por tipo
export const getHighlightsByType = async (type) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, highlightsCollection),
        where('meritType', '==', type),
        orderBy('highlightDate', 'desc'),
        orderBy('name')
      )
    );
    
    const highlights = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      highlightDate: doc.data().highlightDate?.toDate()
    }));
    
    // Retorna os destaques em ordem aleatória
    return shuffleArray(highlights);
  } catch (error) {
    console.error(`Erro ao buscar destaques do tipo ${type}:`, error);
    throw error;
  }
};

// Busca destaques recentes (mês atual e anterior)
export const getRecentHighlights = async () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Mês anterior
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  try {
    const allHighlights = await getAllHighlights();
    
    const recentHighlights = allHighlights.filter(highlight => {
      if (!highlight.highlightDate) return false;
      
      const highlightMonth = highlight.highlightDate.getMonth();
      const highlightYear = highlight.highlightDate.getFullYear();
      
      // Verifica se foi destacado no mês atual ou anterior
      return (
        (highlightMonth === currentMonth && highlightYear === currentYear) ||
        (highlightMonth === previousMonth && highlightYear === previousYear)
      );
    });
    
    // Retorna os destaques recentes em ordem aleatória
    return shuffleArray(recentHighlights);
  } catch (error) {
    console.error("Erro ao buscar destaques recentes:", error);
    throw error;
  }
};

// Adiciona um novo destaque
export const addHighlight = async (highlightData) => {
  try {
    // Converte a string de data para Timestamp do Firestore
    const highlightDateObj = highlightData.highlightDate instanceof Date 
      ? highlightData.highlightDate 
      : new Date(highlightData.highlightDate);
    
    const dataToSave = {
      ...highlightData,
      highlightDate: Timestamp.fromDate(highlightDateObj)
    };
    
    const docRef = await addDoc(collection(db, highlightsCollection), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar destaque:", error);
    throw error;
  }
};

// Atualiza um destaque existente
export const updateHighlight = async (id, highlightData) => {
  try {
    const highlightRef = doc(db, highlightsCollection, id);
    
    // Converte a string de data para Timestamp do Firestore
    const highlightDateObj = highlightData.highlightDate instanceof Date 
      ? highlightData.highlightDate 
      : new Date(highlightData.highlightDate);
    
    const dataToUpdate = {
      ...highlightData,
      highlightDate: Timestamp.fromDate(highlightDateObj)
    };
    
    await updateDoc(highlightRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    throw error;
  }
};

// Busca um destaque pelo ID
export const getHighlightById = async (id) => {
  try {
    const highlightDoc = await getDoc(doc(db, highlightsCollection, id));
    
    if (highlightDoc.exists()) {
      const data = highlightDoc.data();
      return {
        id: highlightDoc.id,
        ...data,
        highlightDate: data.highlightDate?.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar destaque por ID:", error);
    throw error;
  }
};

// Remove um destaque
export const deleteHighlight = async (id) => {
  try {
    await deleteDoc(doc(db, highlightsCollection, id));
    return true;
  } catch (error) {
    console.error("Erro ao remover destaque:", error);
    throw error;
  }
};