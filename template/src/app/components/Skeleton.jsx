import { motion } from 'framer-motion';

export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <motion.div
      className={`${width} ${height} bg-gray-800 rounded-lg ${className}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex-shrink-0 w-64 glass rounded-3xl overflow-hidden p-4 space-y-4">
    <Skeleton width="w-full" height="h-64" className="rounded-2xl" />
    <Skeleton width="w-3/4" height="h-6" />
    <Skeleton width="w-1/2" height="h-4" />
    <div className="flex gap-2">
      <Skeleton width="w-12" height="h-8" className="rounded-lg" />
      <Skeleton width="w-12" height="h-8" className="rounded-lg" />
    </div>
    <Skeleton width="w-full" height="h-10" className="rounded-xl" />
  </div>
);

export const CartItemSkeleton = () => (
  <div className="glass rounded-2xl p-4 space-y-3">
    <div className="flex gap-3">
      <Skeleton width="w-20" height="h-20" className="rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton width="w-3/4" height="h-5" />
        <Skeleton width="w-1/2" height="h-4" />
      </div>
    </div>
  </div>
);
