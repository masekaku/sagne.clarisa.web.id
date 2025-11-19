class ModularVideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.currentVideoId = null;
        this.init();
    }

    async init() {
        try {
            await this.loadVideoData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing video player:', error);
        }
    }

    async getVideoList() {
        try {
            const response = await fetch('/api/list');
            if (!response.ok) throw new Error('Failed to fetch video list');
            return await response.json();
        } catch (error) {
            console.error('Error fetching video list:', error);
            return [];
        }
    }

    async getVideoData(videoId) {
        try {
            const response = await fetch(`/api/videos?videoID=${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch video data');
            return await response.json();
        } catch (error) {
            console.error('Error fetching video data:', error);
            return null;
        }
    }

    async loadVideoData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let videoId = urlParams.get('videoID');

            if (!videoId) {
                const videos = await this.getVideoList();
                if (videos.length > 0) {
                    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
                    videoId = randomVideo.id;
                    // Update URL tanpa reload page
                    window.history.replaceState({}, '', `?videoID=${videoId}`);
                }
            }

            if (videoId) {
                const videoData = await this.getVideoData(videoId);
                if (videoData && videoData.source) {
                    this.currentVideoId = videoData.id;
                    this.videoElement.src = videoData.source;
                    this.videoElement.load();
                    await this.setupVideoAutoplay();
                }
            }
        } catch (error) {
            console.error('Error loading video data:', error);
        }
    }

    async setupVideoAutoplay() {
        const playVideo = async () => {
            try {
                await this.videoElement.play();
                this.trackHistatsEvent('play');
            } catch (error) {
                console.log('Autoplay prevented, waiting for user interaction:', error);
                
                // Fallback: tunggu interaksi user
                const playOnInteraction = () => {
                    this.videoElement.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
            }
        };

        await playVideo();
    }

    setupEventListeners() {
        // Double-tap untuk play/pause di mobile
        let lastTap = 0;
        this.videoElement.addEventListener('touchend', (event) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                event.preventDefault();
                this.togglePlayPause();
            }
            lastTap = currentTime;
        });

        // Track play events untuk analytics
        this.videoElement.addEventListener('play', () => {
            this.trackHistatsEvent('play');
        });

        // Handle video errors
        this.videoElement.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.trackHistatsEvent('error');
        });
    }

    togglePlayPause() {
        if (this.videoElement.paused) {
            this.videoElement.play();
        } else {
            this.videoElement.pause();
        }
    }

    trackHistatsEvent(action) {
        if (window._Hasync && this.currentVideoId) {
            try {
                _Hasync.push(['_trackEvent', 'video', action, this.currentVideoId]);
            } catch (error) {
                console.error('Histats tracking error:', error);
            }
        }
    }
}

// Initialize player ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModularVideoPlayer();
    });
} else {
    new ModularVideoPlayer();
}