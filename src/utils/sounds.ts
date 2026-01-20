// Simple sound utility using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  click() {
    this.playTone(800, 0.05);
  }

  error() {
    this.playTone(200, 0.2);
  }

  success() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(523, 0.1);
    setTimeout(() => this.playTone(659, 0.1), 100);
    setTimeout(() => this.playTone(784, 0.2), 200);
  }

  firecracker() {
    if (!this.enabled || !this.audioContext) return;
    // Multiple rapid tones for firecracker effect
    const notes = [880, 1046, 1318, 1568, 1760];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 0.2), i * 80);
    });
  }

  hint() {
    this.playTone(1000, 0.1);
  }
}

export const soundManager = new SoundManager();