export interface WordData {
  text: string;
  count: number;
  id: string; // unique identifier for d3 stability
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type PeerMessage = 
  | { type: 'SUBMIT_WORD'; payload: string }
  | { type: 'UPDATE_CLOUD'; payload: WordData[] };

export const MAX_CHAR_LIMIT = 25;