// video-loader.js
document.addEventListener('DOMContentLoaded', function() {
    
    const videoElement = document.getElementById('video'); 
    const loadingMessage = document.getElementById('loadingMessage'); 
    
    if (!videoElement || !loadingMessage) {
        console.error("Elemen HTML hilang: 'video' atau 'loadingMessage' tidak ditemukan.");
        return;
    }

    const baseUrls = {
        videy: "https://cdn.videy.co/",
        quax: "https://qu.ax/"
    };

    /**
     * Memulai pemuatan video dari API backend (/api/videos).
     */
    function loadVideo() {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedVideoId = urlParams.get('videoID');
        
        // Menentukan endpoint API: menggunakan videoID jika ada, jika tidak, memanggil default.
        const apiUrl = requestedVideoId 
            ? `/api/videos?videoID=${requestedVideoId}` 
            : `/api/videos`; 

        fetch(apiUrl)
            .then(handleResponse)
            .then(handleVideoData)
            .catch(handleError);
    }

    /**
     * Memastikan respons HTTP berhasil.
     */
    function handleResponse(response) {
        if (!response.ok) {
            // Melempar error dengan status jika API gagal (misal 404)
            throw new Error(`Gagal memuat API! Status: ${response.status}`);
        }
        return response.json();
    }

    /**
     * Memproses data JSON dan memuat URL video.
     */
    function handleVideoData(data) {
        if (!data.videos || data.videos.length === 0) {
            throw new Error('Video tidak ditemukan atau daftar kosong.');
        }

        const selectedVideo = data.videos[0];
        if (!selectedVideo || !selectedVideo.id) {
            throw new Error('Data video tidak lengkap (ID tidak ditemukan).');
        }

        const source = selectedVideo.source || 'videy';
        // Membuat URL video lengkap
        const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        videoElement.load();
        
        // Setelah video berhasil dimuat
        loadingMessage.style.display = 'none'; // Sembunyikan pesan loading
        videoElement.style.display = 'block'; // Tampilkan video
    }

    /**
     * Menangani error selama proses fetch.
     */
    function handleError(error) {
        loadingMessage.textContent = `Error: ${error.message}`;
        // Mengganti warna background Tailwind untuk indikasi error
        loadingMessage.classList.remove('bg-gray-800'); 
        loadingMessage.classList.add('bg-red-700'); 
        console.error('Pemuatan video gagal:', error);
    }

    loadVideo();
});
