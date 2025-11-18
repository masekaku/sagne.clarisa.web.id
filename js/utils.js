// Ambil videoID dari query string ?videoID=
export function getVideoIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('videoID'); // string
}

// Load daftar video dari JSON
export async function loadVideoList(jsonPath = '/videos.json') {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error('Failed to fetch JSON');
    return await res.json();
  } catch (err) {
    console.error('Failed to load videos.json:', err);
    return [];
  }
}