export const audioManager = {
  init(src) {
    if (typeof window === 'undefined') return;
    // ✅ Usa window como storage persistente entre rehidrataciones
    if (window.__audioInstance) return;
    window.__audioInstance = new Audio(src);
    window.__audioInstance.preload = 'metadata';
  },
  get() {
    return typeof window !== 'undefined' ? window.__audioInstance : null;
  },
  play() {
    this.get()?.play();
  },
  pause() {
    this.get()?.pause();
  },
  toggle() {
    const audio = this.get();
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  },
};
