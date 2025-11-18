// api/videos.js (Logika Backend Node.js)
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Menentukan path ke file data JSON, diasumsikan berada di folder /api
    const filePath = path.join(process.cwd(), 'api', 'video_data.json'); 
    
    // Membaca dan mem-parse data video
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Dapatkan parameter dari URL
    const { videoID, random } = req.query;

    let videosToReturn = [];

    if (videoID) {
      // 1. Permintaan Video Spesifik
      const selectedVideo = data.videos.find(v => v.id === videoID);
      if (selectedVideo) {
        videosToReturn.push(selectedVideo);
      } else {
        // VideoID tidak ditemukan
        return res.status(404).json({ error: 'Video not found' });
      }
    } else if (random === 'true') {
      // 2. Permintaan Video Acak
      if (data.videos && data.videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.videos.length);
        videosToReturn.push(data.videos[randomIndex]);
      } else {
        return res.status(500).json({ error: 'No videos available for random selection' });
      }
    } else {
      // 3. Permintaan Default (Mengembalikan video pertama)
      if (data.videos && data.videos.length > 0) {
        videosToReturn.push(data.videos[0]);
      } else {
        return res.status(500).json({ error: 'No default video available' });
      }
    }

    // Kirim data sebagai respons JSON 200 OK
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ videos: videosToReturn });

  } catch (error) {
    console.error('Error reading video data:', error);
    // Error jika file video_data.json tidak ditemukan/tidak bisa dibaca
    res.status(500).json({ error: 'Failed to load video data from server' });
  }
}
