import { useEffect } from 'react';
import Builder from './pages/Builder.jsx';
import { useConfigStore } from './store/configStore.js';

function App() {
  const { setConfig, setLoading, setError } = useConfigStore();

  useEffect(() => {
    // Load initial config
    const loadConfig = async () => {
      setLoading(true);
      try {
        const response = await fetch('/config.json');
        const config = await response.json();
        setConfig(config);
      } catch (error) {
        console.error('Failed to load config:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [setConfig, setLoading, setError]);

  return <Builder />;
}

export default App;

