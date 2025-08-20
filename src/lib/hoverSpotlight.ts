let raf = 0;
const setVars = (x: number, y: number, r: number) => {
  const root = document.documentElement;
  root.style.setProperty('--mx', x + 'px');
  root.style.setProperty('--my', y + 'px');
  root.style.setProperty('--spot', r + 'px');
};
export function initHoverSpotlight() {
  const root = document.documentElement as HTMLElement & { __spotInit?: boolean };
  if (root.__spotInit) return;
  root.__spotInit = true;

  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;
  let radius = 0;

  const onMove = (ev: PointerEvent | MouseEvent) => {
    const x = 'clientX' in ev ? ev.clientX : lastX;
    const y = 'clientY' in ev ? ev.clientY : lastY;
    const dx = x - lastX;
    const dy = y - lastY;
    const speed = Math.hypot(dx, dy);
    const targetR = Math.max(160, Math.min(360, 160 + speed * 0.9));
    lastX = x; lastY = y;
    cancelAnimationFrame(raf);
    const start = performance.now(); const startR = radius;
    raf = requestAnimationFrame(function tick(t){
      const k = Math.min(1, (t - start) / 120);
      radius = startR + (targetR - startR) * k;
      setVars(lastX, lastY, radius);
      if (k < 1) raf = requestAnimationFrame(tick);
    });
  };

  const onEnter = (ev: PointerEvent | MouseEvent) => { onMove(ev); }
  const onLeave = () => setVars(lastX, lastY, 0);

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerenter', onEnter, { passive: true });
  window.addEventListener('pointerleave', onLeave, { passive: true });
  // start hidden
  onLeave();
}
