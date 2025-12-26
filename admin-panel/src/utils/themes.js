// 5 Thèmes prédéfinis avec typographies modernes et tendances 2025
export const PREDEFINED_THEMES = [
  {
    id: 'neo-brutalist',
    name: 'Neo Brutalist',
    icon: '🔲',
    description: 'Bold, high contrast, geometric',
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#ffff00',
      accentColor: '#ff00ff',
      backgroundColor: '#0a0a0a', // Fond sombre néo-brutaliste
      textColor: '#ffffff',
      // Neo Brutaliste: Space Grotesk (titre) + Inter (corps)
      fontFamily: '"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif',
      fontWeight: '700',
      borderRadius: '0px',
      borderWidth: '4px',
      customColors: {
        // Fond néo-brutaliste sombre avec motifs géométriques contrastés
        backgroundGradient: 'repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 20px, #1a1a1a 20px, #1a1a1a 40px), repeating-linear-gradient(-45deg, #0a0a0a 0px, #0a0a0a 20px, #151515 20px, #151515 40px)',
      },
      id: 'neo-brutalist',
    },
  },
  {
    id: 'teenage-engineering',
    name: 'Teenage Engineering',
    icon: '🎛️',
    description: 'Minimal, tech, monochrome',
    theme: {
      primaryColor: '#ffffff',
      secondaryColor: '#e5e5e5',
      accentColor: '#a3a3a3',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      // Teenage Engineering: Roboto Condensed (ultra light/condensed style)
      fontFamily: '"Roboto Condensed", "DIN 2014", "Helvetica Neue", system-ui, -apple-system, sans-serif',
      fontWeight: '300',
      borderRadius: '2px',
      borderWidth: '1px',
      customColors: {},
      id: 'teenage-engineering',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    description: 'Warm, vibrant, energetic',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#fb923c',
      accentColor: '#fdba74',
      backgroundColor: '#1c1917',
      textColor: '#ffffff',
      // Sunset: Poppins (titre) + Outfit (corps) - formes arrondies et chaleureuses
      fontFamily: '"Poppins", "Outfit", "Montserrat", system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      borderRadius: '16px',
      borderWidth: '1px',
      customColors: {},
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    description: 'Cool, calm, refreshing',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#06b6d4',
      accentColor: '#22d3ee',
      backgroundColor: '#0c0a09',
      textColor: '#ffffff',
      // Ocean: Inter (titre) + Sora (corps) - fluide et moderne
      fontFamily: '"Inter", "Sora", "Plus Jakarta Sans", "Manrope", system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      borderRadius: '12px',
      borderWidth: '1px',
      customColors: {},
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    description: 'Natural, green, organic',
    theme: {
      primaryColor: '#16a34a',
      secondaryColor: '#22c55e',
      accentColor: '#4ade80',
      backgroundColor: '#0a0f0a',
      textColor: '#ffffff',
      // Forest: Lora (serif organique) + Cabin (sans-serif humaniste)
      fontFamily: '"Lora", "Merriweather", "Source Serif 4", "Cabin", system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      borderRadius: '20px',
      borderWidth: '2px',
      customColors: {},
    },
  },
];
