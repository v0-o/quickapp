import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore.js';

export const FlyingBadge = () => {
    const { animations, removeAnimation } = useUIStore();

    return (
        <AnimatePresence>
            {animations.map((anim) => (
                <motion.div
                    key={anim.id}
                    initial={{
                        left: anim.startX,
                        top: anim.startY,
                        opacity: 1,
                        scale: 1,
                        position: 'fixed',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                    animate={{
                        left: [anim.startX, anim.midX, anim.endX],
                        top: [anim.startY, anim.midY, anim.endY],
                        opacity: [1, 1, 0.9, 0],
                        scale: [1, 1.2, 0.3]
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth arc
                        times: [0, 0.5, 1],
                        opacity: { times: [0, 0.7, 0.9, 1] }
                    }}
                    onAnimationComplete={() => removeAnimation(anim.id)}
                    className="flying-badge-emoji"
                    style={{
                        fontSize: '48px',
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                        textShadow: '0 0 20px rgba(251,146,60,0.6)'
                    }}
                >
                    {anim.emoji || '🛒'}
                </motion.div>
            ))}
        </AnimatePresence>
    );
};
