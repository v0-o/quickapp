import { useConfigStore } from '../store/configStore.js';

export default function ContactEditor() {
  const { config, updateConfig } = useConfigStore();

  const contact = config?.contact || {};
  const social = config?.social || {};

  const handleContactChange = (key, value) => {
    updateConfig({
      contact: { ...contact, [key]: value },
    });
  };

  const handleSocialChange = (key, value) => {
    updateConfig({
      social: { ...social, [key]: value },
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
          Contact
        </label>
        
        <div className="space-y-2">
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
            placeholder="Email"
          />
          
          <input
            type="tel"
            value={contact.phone || ''}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
            placeholder="Téléphone"
          />
          
          <input
            type="text"
            value={contact.whatsapp || ''}
            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
            placeholder="WhatsApp"
          />
          
          <input
            type="url"
            value={social.instagram || ''}
            onChange={(e) => handleSocialChange('instagram', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
            placeholder="Instagram URL"
          />
        </div>
      </div>
    </div>
  );
}
