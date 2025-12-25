import { motion } from 'framer-motion';

/**
 * Skeleton placeholder for ProductCard during loading
 * Provides visual feedback and improves perceived performance
 */
export const ProductCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="snap-center flex-shrink-0 w-80 glass rounded-3xl relative overflow-hidden h-[520px] flex flex-col"
        >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer-overlay" />

            {/* Media placeholder */}
            <div className="relative flex-1 w-full bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
                </div>
            </div>

            {/* Content placeholder */}
            <div className="p-4 flex flex-col gap-3 bg-black/20">
                {/* Title row */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                    <div className="w-16 h-6 bg-white/10 rounded-lg" />
                </div>

                {/* Buttons placeholder */}
                <div className="flex gap-3">
                    <div className="flex-1 h-[52px] bg-white/10 rounded-xl" />
                    <div className="flex-1 h-[52px] bg-white/10 rounded-xl" />
                    <div className="flex-1 h-[52px] bg-white/10 rounded-xl" />
                </div>
            </div>
        </motion.div>
    );
};
