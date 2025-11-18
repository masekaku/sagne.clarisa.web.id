document.addEventListener('DOMContentLoaded', function() {
  const videoElement = document.getElementById('video');
  const wrapper = document.getElementById('video-wrapper');
  const tapIndicator = document.getElementById('tap-indicator');
  const loadingMessage = document.getElementById('loadingMessage');

  const BASE_URLS = {
    quax: "https://qu.ax/",
    videy: "https://cdn.videy.co/"
  };
  const DEFAULT_EXTENSION = ".mp4";

  // Ambil videoID dari query string
  const urlParams = new URLSearchParams(window.location.search);
  const videoID = urlParams.get('videoID');

  // Load videos.json
  fetch('/videos.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.videos || data.videos.length === 0) throw new Error("No videos found");

      const selectedVideo = data.videos.find(v => v.id === videoID);
      if (!selectedVideo) throw new Error("Video not found");

      const baseUrl = BASE_URLS[selectedVideo.source] || BASE_URLS.videy;
      videoElement.src = `${baseUrl}${selectedVideo.id}${DEFAULT_EXTENSION}`;
      videoElement.load();
      videoElement.play().catch(() => {});

      if (loadingMessage) loadingMessage.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      if (loadingMessage) loadingMessage.textContent = `Error: ${err.message}`;
    });

  // Double-tap play/pause
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
});