import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saied.healthcare',
  appName: 'SAIED Healthcare',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;