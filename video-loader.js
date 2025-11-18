// video-loader.js
document.addEventListener('DOMContentLoaded', function() {
    
    const videoElement = document.getElementById('video'); 
    const loadingMessage = document.getElementById('loadingMessage'); 
    
    if (!videoElement || !loadingMessage) {
        console.error("HTML Elements missing: 'video' or 'loadingMessage' not found.");
        return;
    }

    const baseUrls = {
        videy: "https://cdn.videy.co/",
        quax: "https://qu.ax/"
    };

    function loadVideo() {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedVideoId = urlParams.get('videoID');
        
        const apiUrl = requestedVideoId 
            ? `/api/videos?videoID=${requestedVideoId}` 
            : `/api/videos`; 

        fetch(apiUrl)
            .then(handleResponse)
            .then(handleVideoData)
            .catch(handleError);
    }

    async function handleResponse(response) {
        if (response.ok) {
            // Jika sukses (200 OK), langsung kembalikan JSON
            return response.json();
        }
        
        // Coba baca respons sebagai JSON untuk mendapatkan pesan error dari API
        const errorType = response.headers.get('content-type')?.includes('application/json') ? 'JSON' : 'HTML/TEXT';
        
        if (errorType === 'JSON') {
             // Jika error dari server berupa JSON yang valid (misal: 404 dari videos.js)
            const errorBody = await response.json();
            throw new Error(`API Error ${response.status}: ${errorBody.message || errorBody.error}`);
        } else {
            // Ini akan menangkap error "Unexpected token <" (HTML/Text response)
            throw new Error(`Server returned status ${response.status}. Expected JSON but got ${errorType}.`);
        }
    }

    function handleVideoData(data) {
        if (!data.videos || data.videos.length === 0) {
            throw new Error('Video not found or list is empty.');
        }

        const selectedVideo = data.videos[0];
        if (!selectedVideo || !selectedVideo.id) {
            throw new Error('Video data is incomplete (ID not found).');
        }

        const source = selectedVideo.source || 'videy';
        const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        videoElement.load();
        
        loadingMessage.style.display = 'none'; 
        videoElement.style.display = 'block'; 
    }

    function handleError(error) {
        loadingMessage.textContent = `Error: ${error.message}`;
        loadingMessage.classList.remove('bg-gray-800'); 
        loadingMessage.classList.add('bg-red-700'); 
        console.error('Video loading failed:', error);
    }

    loadVideo();
});
