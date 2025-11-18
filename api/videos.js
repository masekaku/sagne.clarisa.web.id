// api/videos.js
// Menggunakan import karena package.json sudah disetel ke "type": "module"
import fs from 'fs';
import path from 'path';

// Fungsi bantuan untuk mendapatkan direktori kerja saat ini
function getProjectRoot() {
    // process.cwd() adalah cara paling andal untuk mendapatkan root proyek
    return process.cwd(); 
}

export default async function handler(req, res) {
  try {
    // 1. Menentukan Jalur File Data
    // Jalur diperbaiki: dari root proyek masuk ke folder 'api'
    const filePath = path.join(getProjectRoot(), 'api', 'video_data.json'); 
    
    // 2. Membaca dan mem-parse data video
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const { videoID, random } = req.query;
    let videosToReturn = [];

    if (videoID) {
      // 1. Permintaan Video Spesifik
      const selectedVideo = data.videos.find(v => v.id === videoID);
      if (selectedVideo) {
        videosToReturn.push(selectedVideo);
      } else {
        // 404 jika videoID tidak ditemukan
        return res.status(404).json({ error: 'Video not found', message: `Video dengan ID ${videoID} tidak ada.` });
      }
    } else if (random === 'true') {
      // 2. Permintaan Video Acak
      if (data.videos && data.videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.videos.length);
        videosToReturn.push(data.videos[randomIndex]);
      } else {
        return res.status(500).json({ error: 'No videos available' });
      }
    } else {
      // 3. Permintaan Default (Mengembalikan video pertama)
      if (data.videos && data.videos.length > 0) {
        videosToReturn.push(data.videos[0]);
      } else {
         // Jika file JSON kosong
        return res.status(500).json({ error: 'No default video available in data file.' });
      }
    }

    // Mengembalikan respons JSON yang sukses
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ videos: videosToReturn });

  } catch (error) {
    console.error('SERVER ERROR: Failed to process request or read data:', error);
    // Mengembalikan error 500 jika ada masalah server (file path salah, JSON malformed, dll.)
    res.status(500).json({ error: 'Internal Server Error', message: 'Gagal memuat data dari server.' });
  }
}
