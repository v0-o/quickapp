import { memo } from 'react';

const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white hover:shadow-lg',
    secondary: 'glass text-white hover:bg-white/20',
    ghost: 'text-white hover:bg-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-xl font-semibold transition-all
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      {...props}
    >
      {loading ? '⏳' : children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
