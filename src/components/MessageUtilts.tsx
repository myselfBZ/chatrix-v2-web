export const formatMessageTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.getHours().toString().padStart(2, '0') + ':' + 
         d.getMinutes().toString().padStart(2, '0');
};

// Create a simple tick sound using Web Audio API
export const playTickSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillator for the tick sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // High frequency for a crisp tick
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
  
  // Quick fade out
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const AnimatedClock = ({ className }: { className?: string }) => (
  <svg 
    className={`inline-block animate-fadeIn ${className}`}
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line 
      x1="12" 
      y1="12" 
      x2="12" 
      y2="6" 
      className="origin-center animate-spin"
      style={{ animationDuration: '2s' }}
    />
    <line 
      x1="12" 
      y1="12" 
      x2="16" 
      y2="12"
      className="origin-center animate-spin" 
      style={{ animationDuration: '8s' }}
    />
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={`inline-block animate-scaleIn ${className}`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);