import { getVideoIdFromQuery, loadVideoList } from './utils.js';

const videoElement = document.getElementById('video');
const wrapper = document.getElementById('video-wrapper');
const tapIndicator = document.getElementById('tap-indicator');

const videoId = getVideoIdFromQuery();

// Double-tap play/pause untuk mobile
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

// Load video dari JSON sesuai videoID
loadVideoList().then(videos => {
    const selectedVideo = videos.find(v => v.id === videoId);
    if (!selectedVideo) {
        console.error('Video not found');
        return;
    }
    videoElement.src = selectedVideo.url;
    videoElement.load();
    videoElement.play().catch(() => {});
});