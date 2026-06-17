export function initClock() {
  document.getElementById('year').textContent = new Date().getFullYear();
  const el = document.getElementById('footer-clock');
  const tick = () => {
    try {
      el.textContent = 'IST ' + new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });
    } catch {
      el.textContent = '';
    }
  };
  tick();
  setInterval(tick, 1000);
}
