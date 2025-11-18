import { getVideoIdFromPath, loadVideoList } from './utils.js';

const video = document.getElementById('video');
const wrapper = document.getElementById('video-wrapper');
const tapIndicator = document.getElementById('tap-indicator');

const videoId = getVideoIdFromPath();

// Double-tap play/pause di mobile
let lastTap = 0;
wrapper.addEventListener('touchend', () => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength < 300 && tapLength > 0) {
    if (video.paused) {
      video.play();
      tapIndicator.textContent = "▶️";
    } else {
      video.pause();
      tapIndicator.textContent = "⏸️";
    }
    tapIndicator.style.opacity = 1;
    setTimeout(() => { tapIndicator.style.opacity = 0; }, 600);
  }
  lastTap = currentTime;
});

// Load video sesuai ID
loadVideoList().then(videos => {
  const selectedVideo = videos.find(v => v.id === videoId);
  if (selectedVideo) {
    video.src = selectedVideo.url;
    video.load();
    video.play().catch(() => {});
  }
});