import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transform transition-all duration-300
    hover:scale-105 active:scale-95 
  `;

  const variants = {
    primary: `
      bg-primary hover:bg-primary-dark text-secondary
      focus:ring-primary/50 shadow-md hover:shadow-lg
      hover:shadow-primary/20
    `,
    secondary: `
      bg-secondary dark:bg-secondary-light hover:bg-secondary-dark 
      text-white dark:text-secondary
      focus:ring-secondary/50 shadow-md hover:shadow-lg
      hover:shadow-secondary/20
    `,
    outline: `
      bg-transparent border-2 border-primary text-primary dark:text-primary
      hover:bg-primary/10 focus:ring-primary/50
    `,
    ghost: `
      bg-transparent text-primary dark:text-primary hover:bg-primary/10
      focus:ring-primary/50
    `,
    white: `
    bg-white text-primary dark:text-primary hover:bg-primary/10
    focus:ring-primary/50
  `,
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${className}
  `;

  if (href) {
    return (
      <a 
        href={href} 
        ref={ref} 
        className={classes} 
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      ref={ref} 
      className={classes} 
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;