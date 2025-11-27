// A vibrant palette for the word cloud
const colors = [
  '#38bdf8', // Sky 400
  '#818cf8', // Indigo 400
  '#c084fc', // Purple 400
  '#f472b6', // Pink 400
  '#fb7185', // Rose 400
  '#34d399', // Emerald 400
  '#fbbf24', // Amber 400
  '#a78bfa', // Violet 400
];

export const getColor = (index: number): string => {
  return colors[index % colors.length];
};

export const generateRoomId = (): string => {
  // Generate a friendly 6-char ID
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 for clarity
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
