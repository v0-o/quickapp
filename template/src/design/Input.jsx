import { memo, forwardRef } from 'react';

const Input = memo(forwardRef(({
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-xl
          bg-gray-900 border-2 border-gray-700
          text-white placeholder-gray-500
          focus:border-orange-500 focus:outline-none
          transition-colors duration-200
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </motion.div>
  );
}));

Input.displayName = 'Input';
export default Input;
