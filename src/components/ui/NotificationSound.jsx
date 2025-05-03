import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectIsSoundEnabled } from '../../redux/slices/notificationsSlice';

// Component to handle notification sounds
const NotificationSound = () => {
  const audioRef = useRef(null);
  const lastPlayedRef = useRef(0);
  const soundEnabled = useSelector(selectIsSoundEnabled);
  
  // Play sound effect for new notifications
  useEffect(() => {
    // Only play if sound is enabled and it's been at least 3 seconds since last play
    // This prevents too many sounds playing in rapid succession
    if (soundEnabled) {
      const now = Date.now();
      if (now - lastPlayedRef.current > 3000) {
        try {
          // Create a new audio context
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioContext = new AudioContext();
          
          // Play a simple notification beep
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Fade out for a smoother sound
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          
          // Also try to play the audio file
          if (audioRef.current) {
            audioRef.current.play().catch(err => {
              console.log('Failed to play sound file:', err);
              // The oscillator is our fallback
            });
          }
          
          lastPlayedRef.current = now;
        } catch (error) {
          console.error('Error playing notification sound:', error);
        }
      }
    }
  }, [soundEnabled]);
  
  // Render the audio element but hidden
  return (
    <audio 
      ref={audioRef} 
      src="/sounds/notification.mp3" 
      preload="auto"
      style={{ display: 'none' }} 
    />
  );
};

export default NotificationSound;