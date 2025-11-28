import { PeerJSOption } from 'peerjs';

/**
 * Optimized PeerJS configuration for faster connections
 * Using custom PeerJS Cloud server with better reliability
 */
export const PEER_CONFIG: PeerJSOption = {
  host: 'peer-server.fly.dev',
  port: 443,
  path: '/',
  secure: true,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  },
  debug: 0, // Set to 3 for debugging
};

/**
 * Fallback to default server if custom server fails
 */
export const PEER_CONFIG_FALLBACK: PeerJSOption = {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  },
};
