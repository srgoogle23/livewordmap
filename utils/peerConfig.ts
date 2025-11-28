import { PeerJSOption } from 'peerjs';

/**
 * PeerJS configuration using default cloud server (0.peerjs.com)
 * With optimized STUN servers for better P2P connectivity
 */
export const PEER_CONFIG: PeerJSOption = {
  debug: 0, // Set to 3 for debugging
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ]
  },
};
