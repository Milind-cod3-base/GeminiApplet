import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateClips(videoId, timecodes) {
  const clipDuration = 30; // seconds
  // Use the provided videoId directly as the path for standalone testing
  const videoPath = path.join('D:', 'YazanFolder', videoId); // Adjusted for your video location
  const outputDir = path.join(__dirname, 'clips'); // Clips stored in backend/clips

  // Create output directory if it doesn’t exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Verify video file exists
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found at ${videoPath}`);
  }

  const clipPromises = timecodes.map(async ({ time, text }, index) => {
    const timeSecs = parseTimeToSeconds(time);
    let startTime = Math.max(0, timeSecs - clipDuration / 2); // Center clip around timecode
    let endTime = startTime + clipDuration;

    const outputPath = path.join(outputDir, `clip_${index}_${videoId}`);

    await cutVideo(videoPath, startTime, clipDuration, outputPath);
    return outputPath;
  });

  const clipPaths = await Promise.all(clipPromises);
  return clipPaths;
}

function parseTimeToSeconds(timeStr) {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function cutVideo(inputPath, startTime, duration, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}