const videoElement = document.getElementById('video');
const wrapper = document.getElementById('video-wrapper');
const tapIndicator = document.getElementById('tap-indicator');

// Ambil videoID dari query string ?videoID=
function getVideoIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('videoID');
}

// Load daftar video dari JSON
async function loadVideoList(jsonPath = '/videos.json') {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error('Failed to fetch JSON');
    return await res.json();
  } catch (err) {
    console.error('Failed to load videos.json:', err);
    return [];
  }
}

// Mapping source ke base URL
const SOURCE_BASE_URL = {
  videy: "https://cdn.videy.co/",
  quax: "https://qu.ax/"
};

const DEFAULT_EXTENSION = ".mp4";

// Double-tap play/pause mobile
let lastTap = 0;
wrapper.addEventListener('touchend', () => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength < 300 && tapLength > 0) {
    if (videoElement.paused) {
      videoElement.play();
      tapIndicator.textContent = "▶️";
    } else {
      videoElement.pause();
      tapIndicator.textContent = "⏸️";
    }
    tapIndicator.style.opacity = 1;
    setTimeout(() => { tapIndicator.style.opacity = 0; }, 600);
  }
  lastTap = currentTime;
});

// Load video sesuai videoID
const videoId = getVideoIdFromQuery();
loadVideoList().then(videos => {
  const selectedVideo = videos.find(v => v.id === videoId);
  if (!selectedVideo) {
    console.error('Video not found');
    return;
  }

  const baseUrl = SOURCE_BASE_URL[selectedVideo.source];
  if (!baseUrl) {
    console.error('Unknown source:', selectedVideo.source);
    return;
  }

  videoElement.src = `${baseUrl}${selectedVideo.id}${DEFAULT_EXTENSION}`;
  videoElement.load();
  videoElement.play().catch(() => {});
});