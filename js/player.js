import { getVideoIdFromQuery, loadVideoList } from './utils.js';

const videoElement = document.getElementById('video');
const wrapper = document.getElementById('video-wrapper');
const tapIndicator = document.getElementById('tap-indicator');

const videoId = getVideoIdFromQuery();

const SOURCE_BASE_URL = {
  videy: "https://cdn.videy.co/",
  quax: "https://qu.ax/"
};

const DEFAULT_EXTENSION = ".mp4";

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