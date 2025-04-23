import { generateClips } from './videoProcessor.mjs';
import path from 'path';

// Path to your local video
const videoPath = path.join('D:', 'YazanFolder', 'nascar_test.mp4');

// Dummy timestamps and text
const timecodes = [
  { time: "00:00:10", text: "First key moment" },
  { time: "00:01:23", text: "Second key moment" }
];

// Call the generateClips function
generateClips('nascar_test.mp4', timecodes)
  .then(clipPaths => {
    console.log('Clips generated:', clipPaths);
  })
  .catch(error => {
    console.error('Error generating clips:', error);
  });