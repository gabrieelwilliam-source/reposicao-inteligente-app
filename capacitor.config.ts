import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.frdistribuidora.reposicao',
  appName: 'Reposição Inteligente',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  android: {
    useLegacyBridge: true,
  },
};

export default config;
