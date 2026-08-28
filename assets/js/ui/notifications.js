export function toast(msg, opts = {}) {
  const c = document.getElementById('toasts');
  if (!c) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  if (opts.variant === 'error') el.style.background = '#7a1f1f';
  c.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    el.style.transition = 'all .25s';
    setTimeout(() => el.remove(), 260);
  }, opts.duration || 2200);
}
