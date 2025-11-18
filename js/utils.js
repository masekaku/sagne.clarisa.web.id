// Ambil video ID dari path modern /f/1
export function getVideoIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  // /f/1 → ["", "f", "1"]
  return parseInt(pathParts[2]) || 1;
}

// Load daftar video dari JSON
export async function loadVideoList(jsonPath = 'videos.json') {
  try {
    const res = await fetch(jsonPath);
    return await res.json();
  } catch (err) {
    console.error('Failed to load videos.json:', err);
    return [];
  }
}