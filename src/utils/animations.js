// src/utils/animations.js
// Utilitários de animação para a aplicação DevClub Stars

/**
 * Utilitário para animações baseadas em Intersection Observer
 * @param {Object} options - Opções de configuração
 * @param {Function} options.onEnter - Callback executado quando o elemento entra na viewport
 * @param {Function} options.onExit - Callback executado quando o elemento sai da viewport
 * @param {Number} options.threshold - Porcentagem do elemento que deve estar visível para disparar os callbacks (0 a 1)
 * @param {Number} options.rootMargin - Margem em torno do elemento para disparar os callbacks (ex: "0px 0px -100px 0px")
 * @returns {Object} - Retorna o observer e o método para desconectar o observer
 */
export const useIntersectionAnimation = ({
    onEnter,
    onExit,
    threshold = 0.1,
    rootMargin = "0px",
  }) => {
    // Cria o observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter && onEnter(entry.target);
          } else {
            onExit && onExit(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
  
    // Método para observar um elemento
    const observe = (element) => {
      if (element) {
        observer.observe(element);
      }
    };
  
    // Método para parar de observar
    const unobserve = (element) => {
      if (element) {
        observer.unobserve(element);
      }
    };
  
    // Método para desconectar o observer
    const disconnect = () => {
      observer.disconnect();
    };
  
    return { observe, unobserve, disconnect };
  };
  
  /**
   * Animação de entrada com fade e slide
   * @param {HTMLElement} element - Elemento a ser animado
   * @param {String} direction - Direção da animação (up, down, left, right)
   * @param {Number} duration - Duração da animação em ms
   * @param {Number} delay - Atraso para iniciar a animação em ms
   */
  export const fadeInSlide = (element, direction = 'up', duration = 500, delay = 0) => {
    if (!element) return;
    
    // Configurações iniciais
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    element.style.transitionDelay = `${delay}ms`;
    
    // Define a transformação com base na direção
    switch (direction) {
      case 'up':
        element.style.transform = 'translateY(20px)';
        break;
      case 'down':
        element.style.transform = 'translateY(-20px)';
        break;
      case 'left':
        element.style.transform = 'translateX(20px)';
        break;
      case 'right':
        element.style.transform = 'translateX(-20px)';
        break;
      default:
        element.style.transform = 'translateY(20px)';
    }
    
    // Aplica a animação após um pequeno delay para garantir que as propriedades iniciais foram aplicadas
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translate(0, 0)';
    }, 10);
  };
  
  /**
   * Animação de destaque pulsante
   * @param {HTMLElement} element - Elemento a ser animado
   * @param {String} color - Cor do destaque (hex, rgb, etc)
   * @param {Number} duration - Duração da animação em ms
   */
  export const pulseHighlight = (element, color = '#37E359', duration = 1500) => {
    if (!element) return;
    
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;
    
    // Primeira fase: Destaque
    element.style.transition = `box-shadow ${duration / 3}ms ease-out`;
    element.style.boxShadow = `0 0 0 4px ${color}33, 0 0 0 8px ${color}22, 0 0 20px ${color}11`;
    
    // Segunda fase: Retorno ao normal
    setTimeout(() => {
      element.style.transition = `box-shadow ${duration * 2 / 3}ms ease-in`;
      element.style.boxShadow = originalBoxShadow;
      
      // Restaura a transição original
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration * 2 / 3);
    }, duration / 3);
  };
  
  /**
   * Efeito de digitação de texto
   * @param {HTMLElement} element - Elemento onde o texto será digitado
   * @param {String} text - Texto a ser digitado
   * @param {Number} speed - Velocidade de digitação (ms por caractere)
   * @param {Number} initialDelay - Atraso inicial antes de começar a digitação
   * @param {Function} onComplete - Callback executado ao terminar a digitação
   */
  export const typeText = (element, text, speed = 50, initialDelay = 0, onComplete = null) => {
    if (!element) return;
    
    let i = 0;
    element.textContent = '';
    
    setTimeout(() => {
      const typing = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typing);
          if (onComplete) onComplete();
        }
      }, speed);
    }, initialDelay);
  };
  
  /**
   * Animação de contador
   * @param {HTMLElement} element - Elemento onde será exibido o contador
   * @param {Number} startValue - Valor inicial
   * @param {Number} endValue - Valor final
   * @param {Number} duration - Duração da animação em ms
   * @param {String} prefix - Prefixo para o valor (ex: "$")
   * @param {String} suffix - Sufixo para o valor (ex: "%")
   * @param {Boolean} formatNumber - Se deve formatar o número com separador de milhares
   */
  export const animateCounter = (
    element,
    startValue,
    endValue,
    duration = 1500,
    prefix = '',
    suffix = '',
    formatNumber = false
  ) => {
    if (!element) return;
    
    const startTime = performance.now();
    const changeInValue = endValue - startValue;
    
    const formatWithCommas = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        const value = startValue + changeInValue * (elapsedTime / duration);
        const displayValue = formatNumber 
          ? formatWithCommas(Math.floor(value))
          : Math.floor(value);
        
        element.textContent = `${prefix}${displayValue}${suffix}`;
        requestAnimationFrame(updateCounter);
      } else {
        const finalDisplayValue = formatNumber 
          ? formatWithCommas(endValue)
          : endValue;
        
        element.textContent = `${prefix}${finalDisplayValue}${suffix}`;
      }
    };
    
    requestAnimationFrame(updateCounter);
  };