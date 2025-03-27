// src/services/studentService.js
// Serviços para gerenciar os dados dos alunos no Firebase

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

const studentsCollection = 'students';

// Função para embaralhar arrays (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Busca todos os alunos
export const getAllStudents = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, studentsCollection), orderBy('name'))
    );
    
    // Convertemos os documentos do Firestore para objetos JavaScript
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      hireDate: doc.data().hireDate?.toDate() // Converte Timestamp para Date
    }));

    return students;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    throw error;
  }
};

// Busca alunos com destaque
export const getFeaturedStudents = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, studentsCollection),
        where('featured', '==', true),
        orderBy('name')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      hireDate: doc.data().hireDate?.toDate()
    }));
  } catch (error) {
    console.error("Erro ao buscar alunos em destaque:", error);
    throw error;
  }
};

// Busca alunos com foto para exibição na página inicial
export const getStudentsWithPhotos = async (limit = 4) => {
  try {
    const allStudents = await getAllStudents();
    const studentsWithPhotos = allStudents.filter(student => student.photoUrl);
    
    // Embaralha os alunos com fotos e retorna apenas a quantidade solicitada
    return shuffleArray(studentsWithPhotos).slice(0, limit);
  } catch (error) {
    console.error("Erro ao buscar alunos com fotos:", error);
    throw error;
  }
};

// Busca alunos contratados no mês atual ou anterior
// Busca alunos contratados no mês atual e nos dois meses anteriores
export const getRecentlyHiredStudents = async () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Mês anterior (1 mês atrás)
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  // Dois meses atrás
  const twoMonthsAgo = currentMonth <= 1 ? currentMonth + 10 : currentMonth - 2;
  const twoMonthsAgoYear = currentMonth <= 1 ? currentYear - 1 : currentYear;
  
  try {
    const allStudents = await getAllStudents();
    
    const recentStudents = allStudents.filter(student => {
      if (!student.hireDate) return false;
      
      const hireMonth = student.hireDate.getMonth();
      const hireYear = student.hireDate.getFullYear();
      
      // Verifica se foi contratado no mês atual ou nos dois meses anteriores
      return (
        (hireMonth === currentMonth && hireYear === currentYear) ||
        (hireMonth === previousMonth && hireYear === previousYear) ||
        (hireMonth === twoMonthsAgo && hireYear === twoMonthsAgoYear)
      );
    });
    
    // Retorna os alunos recentes em ordem aleatória
    return shuffleArray(recentStudents);
  } catch (error) {
    console.error("Erro ao buscar alunos recém contratados:", error);
    throw error;
  }
};

// Adiciona um novo aluno
export const addStudent = async (studentData) => {
  try {
    // Converte a string de data para Timestamp do Firestore
    const hireDateObj = studentData.hireDate instanceof Date 
      ? studentData.hireDate 
      : new Date(studentData.hireDate);
    
    const dataToSave = {
      ...studentData,
      hireDate: Timestamp.fromDate(hireDateObj),
      featured: Boolean(studentData.featured)
    };
    
    const docRef = await addDoc(collection(db, studentsCollection), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    throw error;
  }
};

// Atualiza um aluno existente
export const updateStudent = async (id, studentData) => {
  try {
    const studentRef = doc(db, studentsCollection, id);
    
    // Converte a string de data para Timestamp do Firestore
    const hireDateObj = studentData.hireDate instanceof Date 
      ? studentData.hireDate 
      : new Date(studentData.hireDate);
    
    const dataToUpdate = {
      ...studentData,
      hireDate: Timestamp.fromDate(hireDateObj),
      featured: Boolean(studentData.featured)
    };
    
    await updateDoc(studentRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw error;
  }
};

// Busca um aluno pelo ID
export const getStudentById = async (id) => {
  try {
    const studentDoc = await getDoc(doc(db, studentsCollection, id));
    
    if (studentDoc.exists()) {
      const data = studentDoc.data();
      return {
        id: studentDoc.id,
        ...data,
        hireDate: data.hireDate?.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar aluno por ID:", error);
    throw error;
  }
};

// Remove um aluno
export const deleteStudent = async (id) => {
  try {
    await deleteDoc(doc(db, studentsCollection, id));
    return true;
  } catch (error) {
    console.error("Erro ao remover aluno:", error);
    throw error;
  }
};