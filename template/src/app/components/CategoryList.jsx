import { CATEGORIES } from '../constants/index.js';

export const CategoryList = ({ selectedCategory, onCategoryChange, scrollRef }) => {
    return (
        <div className="relative group">
            {/* Gradient Fade Indicator - Right Side */}
            <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-[#05090b] to-transparent pointer-events-none z-10 opacity-80" />

            <div
                className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                ref={scrollRef}
            >
                {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`
                                relative flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm 
                                transition-all duration-300 backdrop-blur-xl snap-start
                                ${isActive
                                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)] scale-105 border border-white/20`
                                    : `bg-gradient-to-br from-white/8 to-white/4 text-white/70 border border-white/10 hover:from-white/12 hover:to-white/8 hover:text-white hover:border-white/20 hover:scale-102 shadow-sm`
                                }
                                ${category.isNew && !isActive ? 'shadow-[0_0_20px_rgba(234,179,8,0.4),0_0_40px_rgba(234,179,8,0.2)] animate-pulse' : ''}
                            `}
                        >
                            <span className={`mr-2 text-base transition-all duration-300 ${isActive ? 'scale-110 inline-block drop-shadow-lg' : ''}`}>
                                {category.emoji}
                            </span>
                            <span className="tracking-wide">{category.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
