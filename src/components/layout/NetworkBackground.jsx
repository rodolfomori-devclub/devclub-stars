// src/components/layout/NetworkBackground.jsx
import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const NetworkBackground = () => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Declarando particlesArray no início do escopo
    const particlesArray = [];
    const numberOfParticles = Math.min(100, window.innerWidth / 20);
    const maxDistance = Math.min(150, window.innerWidth / 10);
    
    // Inicializa as partículas
    function initParticles() {
      // Limpa o array existente
      particlesArray.length = 0;
      
      // Adiciona novas partículas
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    // Ajusta o tamanho do canvas para preencher a tela
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      
      // Reinicia as partículas quando o tamanho muda
      initParticles();
    };
    
    // Classe para as partículas
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Reposiciona a partícula quando sai da tela
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? 'rgba(55, 227, 89, 0.6)' : 'rgba(11, 43, 17, 0.6)';
        ctx.fill();
      }
    }
    
    // Conecta as partículas com linhas
    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = isDarkMode 
              ? `rgba(55, 227, 89, ${opacity * 0.3})` 
              : `rgba(11, 43, 17, ${opacity * 0.3})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Anima as partículas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Configura os event listeners e inicia a animação
    window.addEventListener('resize', handleResize);
    handleResize(); // Inicializa o tamanho e as partículas
    animate();
    
    // Limpeza ao desmontar o componente
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: isDarkMode ? 'rgb(18, 18, 18)' : 'rgb(248, 249, 250)'
      }}
    />
  );
};

export default NetworkBackground;