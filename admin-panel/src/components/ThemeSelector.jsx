import { useConfigStore } from '../store/configStore.js';
import { PREDEFINED_THEMES } from '../utils/themes.js';

export default function ThemeSelector() {
  const { config, updateTheme } = useConfigStore();

  const handleThemeSelect = (themeData) => {
    // Include theme id in the theme object for CSS targeting
    const themeWithId = {
      ...themeData.theme,
      id: themeData.themeId || themeData.id,
    };
    updateTheme(themeWithId);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/40 mb-3 uppercase tracking-wide">
          Thèmes
        </label>
        <div className="grid grid-cols-5 gap-2">
          {PREDEFINED_THEMES.map((theme) => {
            const isActive = config?.theme &&
              config.theme.primaryColor === theme.theme.primaryColor &&
              config.theme.secondaryColor === theme.theme.secondaryColor;

            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all active:scale-95 ${
                  isActive
                    ? 'bg-white/10 border border-white/20'
                    : 'bg-white/5 border border-white/5 hover:bg-white/8'
                }`}
              >
                <span className="text-2xl">{theme.icon}</span>
                <span className="text-[9px] text-white/60 font-medium">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
