const ensureWindow = () => (typeof window !== 'undefined' ? window : undefined);

export const ensureTangerineNamespace = () => {
  const win = ensureWindow();
  if (!win) return;

  if (!win.Tangerine) {
    win.Tangerine = { components: {} };
  } else if (!win.Tangerine.components) {
    win.Tangerine.components = {};
  }

  if (!win.registerTangerineComponent) {
    win.registerTangerineComponent = (name, component) => {
      win.Tangerine.components[name] = component;
      return component;
    };
  }

  return win.Tangerine.components;
};

export const registerTangerineComponent = (name, componentFactory) => {
  const win = ensureWindow();
  if (!win) {
    return componentFactory;
  }

  const components = ensureTangerineNamespace();
  components[name] = componentFactory;
  return componentFactory;
};
