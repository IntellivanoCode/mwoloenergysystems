'use client';

import { useState, useEffect } from 'react';

// Thèmes professionnels par défaut
export const defaultThemes = {
  corporate: {
    name: 'Corporate Blue',
    type: 'gradient',
    value: 'from-slate-900 via-blue-900 to-slate-900',
    preview: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
  },
  energy: {
    name: 'Energy Green',
    type: 'gradient',
    value: 'from-slate-900 via-emerald-900 to-slate-900',
    preview: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
  },
  sunset: {
    name: 'Sunset Orange',
    type: 'gradient',
    value: 'from-slate-900 via-orange-900 to-slate-900',
    preview: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 50%, #0f172a 100%)',
  },
  purple: {
    name: 'Royal Purple',
    type: 'gradient',
    value: 'from-slate-900 via-purple-900 to-slate-900',
    preview: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
  },
  cyan: {
    name: 'Ocean Cyan',
    type: 'gradient',
    value: 'from-slate-900 via-cyan-900 to-slate-900',
    preview: 'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0f172a 100%)',
  },
};

// URLs de fonds professionnels par défaut
export const defaultBackgrounds = {
  images: [
    {
      name: 'Circuit Board',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    },
    {
      name: 'Energy Lines',
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80',
    },
    {
      name: 'Solar Panels',
      url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80',
    },
    {
      name: 'Power Grid',
      url: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1920&q=80',
    },
    {
      name: 'City Night',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80',
    },
  ],
  videos: [
    {
      name: 'Abstract Waves',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-27432-large.mp4',
    },
    {
      name: 'Energy Flow',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4',
    },
    {
      name: 'Network Lines',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-network-connection-lines-over-a-blue-background-39835-large.mp4',
    },
  ],
};

export interface BackgroundSettings {
  type: 'gradient' | 'image' | 'video';
  value: string;
  overlay: boolean;
  overlayOpacity: number;
}

interface BackgroundConfigProps {
  storageKey: string;
  onSettingsChange?: (settings: BackgroundSettings) => void;
}

export function useBackgroundSettings(storageKey: string) {
  const [settings, setSettings] = useState<BackgroundSettings>({
    type: 'gradient',
    value: defaultThemes.corporate.value,
    overlay: true,
    overlayOpacity: 0.7,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading background settings:', e);
        }
      }
    }
  }, [storageKey]);

  const updateSettings = (newSettings: BackgroundSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    }
  };

  return { settings, updateSettings };
}

export function BackgroundLayer({ settings }: { settings: BackgroundSettings }) {
  if (settings.type === 'video') {
    return (
      <div className="fixed inset-0 overflow-hidden -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src={settings.value} type="video/mp4" />
        </video>
        {settings.overlay && (
          <div 
            className="absolute inset-0 bg-slate-900"
            style={{ opacity: settings.overlayOpacity }}
          />
        )}
      </div>
    );
  }

  if (settings.type === 'image') {
    return (
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.value})` }}
        />
        {settings.overlay && (
          <div 
            className="absolute inset-0 bg-slate-900"
            style={{ opacity: settings.overlayOpacity }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${settings.value}`} />
  );
}

export function BackgroundConfigPanel({
  storageKey,
  onSettingsChange,
  isOpen,
  onClose,
}: BackgroundConfigProps & { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useBackgroundSettings(storageKey);
  const [localSettings, setLocalSettings] = useState(settings);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    onSettingsChange?.(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Configuration de l'arrière-plan</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Type de fond</label>
            <div className="grid grid-cols-3 gap-3">
              {['gradient', 'image', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLocalSettings({ ...localSettings, type: type as any })}
                  className={`p-3 rounded-xl border-2 transition ${
                    localSettings.type === type
                      ? 'border-cyan-500 bg-cyan-500/20 text-white'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {type === 'gradient' && '🎨 Dégradé'}
                  {type === 'image' && '🖼️ Image'}
                  {type === 'video' && '🎬 Vidéo'}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Selection */}
          {localSettings.type === 'gradient' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Thème</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(defaultThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setLocalSettings({ ...localSettings, value: theme.value })}
                    className={`p-3 rounded-xl border-2 transition ${
                      localSettings.value === theme.value
                        ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div
                      className="h-16 rounded-lg mb-2"
                      style={{ background: theme.preview }}
                    />
                    <p className="text-sm text-white">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Selection */}
          {localSettings.type === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Images prédéfinies</label>
                <div className="grid grid-cols-3 gap-3">
                  {defaultBackgrounds.images.map((img) => (
                    <button
                      key={img.name}
                      onClick={() => setLocalSettings({ ...localSettings, value: img.url })}
                      className={`rounded-xl overflow-hidden border-2 transition ${
                        localSettings.value === img.url
                          ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                      <p className="text-xs text-white p-2">{img.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL personnalisée</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                  />
                  <button
                    onClick={() => {
                      if (customUrl) {
                        setLocalSettings({ ...localSettings, value: customUrl });
                        setCustomUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Selection */}
          {localSettings.type === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Vidéos prédéfinies</label>
                <div className="grid grid-cols-3 gap-3">
                  {defaultBackgrounds.videos.map((vid) => (
                    <button
                      key={vid.name}
                      onClick={() => setLocalSettings({ ...localSettings, value: vid.url })}
                      className={`p-3 rounded-xl border-2 transition text-center ${
                        localSettings.value === vid.url
                          ? 'border-cyan-500 bg-cyan-500/20 text-white'
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-2xl block mb-2">🎬</span>
                      <p className="text-sm">{vid.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL vidéo personnalisée</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                  />
                  <button
                    onClick={() => {
                      if (customUrl) {
                        setLocalSettings({ ...localSettings, value: customUrl });
                        setCustomUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Overlay Settings */}
          {(localSettings.type === 'image' || localSettings.type === 'video') && (
            <div>
              <label className="flex items-center gap-3 text-sm text-slate-300 mb-3">
                <input
                  type="checkbox"
                  checked={localSettings.overlay}
                  onChange={(e) => setLocalSettings({ ...localSettings, overlay: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                />
                Ajouter un voile sombre
              </label>
              {localSettings.overlay && (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Opacité du voile: {Math.round(localSettings.overlayOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localSettings.overlayOpacity}
                    onChange={(e) => setLocalSettings({ ...localSettings, overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
