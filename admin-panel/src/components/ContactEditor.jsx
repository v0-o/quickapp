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
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Contact Information
        </label>
        
        <div className="space-y-2">
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="📧 Email"
          />
          
          <input
            type="tel"
            value={contact.phone || ''}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="📱 Phone"
          />
          
          <input
            type="text"
            value={contact.whatsapp || ''}
            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="💬 WhatsApp"
          />
          
          <input
            type="text"
            value={contact.telegram || ''}
            onChange={(e) => handleContactChange('telegram', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="✈️ Telegram"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Social Media
        </label>
        
        <div className="space-y-2">
          <input
            type="url"
            value={social.instagram || ''}
            onChange={(e) => handleSocialChange('instagram', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="📸 Instagram URL"
          />
          
          <input
            type="url"
            value={social.facebook || ''}
            onChange={(e) => handleSocialChange('facebook', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="👥 Facebook URL"
          />
          
          <input
            type="url"
            value={social.twitter || ''}
            onChange={(e) => handleSocialChange('twitter', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="🐦 Twitter URL"
          />
        </div>
      </div>
    </div>
  );
}

