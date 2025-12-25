import { memo } from 'react';

const Card = memo(({
  children,
  variant = 'glass',
  hover = true,
  className = '',
  ...props
}) => {
  const variants = {
    glass: 'glass rounded-3xl overflow-hidden',
    solid: 'bg-gray-900 rounded-3xl overflow-hidden border border-white/10',
    elevated: 'bg-gray-800 rounded-3xl overflow-hidden shadow-lg',
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
export default Card;
