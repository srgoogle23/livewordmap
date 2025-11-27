# LiveWordMap

LiveWordMap is a real-time, peer-to-peer (P2P) word cloud application. It allows a speaker/host to create a room and generate a word cloud based on input from an audience, completely client-side without a traditional backend.

## Features

-   **100% Frontend:** No databases or backend servers required.
-   **P2P Communication:** Uses WebRTC (via PeerJS) to connect Host and Audience directly.
-   **Real-time Visualization:** Word cloud updates instantly using D3.js.
-   **Internationalization:** Support for Portuguese (PT-BR) and English (EN).
-   **Mobile Friendly:** Responsive design for easy audience participation.

## Technologies Used

-   **React** (UI Framework)
-   **TypeScript** (Type safety)
-   **Tailwind CSS** (Styling)
-   **PeerJS** (WebRTC wrapper for P2P connections)
-   **D3.js** (Physics-based visualization)

## How it Works

1.  **Host**: Clicks "Create Room". The app generates a unique Room ID and acts as the connection server (using PeerJS signaling).
2.  **Host Screen**: Displays a QR Code and the live word cloud.
3.  **Audience**: Scans the QR Code or enters the Room ID.
4.  **Audience Screen**: Users type words/phrases.
5.  **Sync**: When a user submits a word, it is sent directly to the Host's browser. The Host updates the word count and broadcasts the new state back to all connected users so everyone sees the cloud evolve.

## Usage

1.  Open the application.
2.  **For Speakers:** Click "Create Room". Share the screen with the QR Code.
3.  **For Attendees:** Scan the QR Code or navigate to the URL provided. Enter a word and press Send.

## License

MIT