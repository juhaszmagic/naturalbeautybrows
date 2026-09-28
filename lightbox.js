// Galéria: kattintásra teljes méretű kép, lapozással
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.gal img'));
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Kép nagyítva');
  box.hidden = true;
  box.innerHTML = '<button class="lb-x" aria-label="Bezárás">×</button>' +
    '<button class="lb-p" aria-label="Előző kép">‹</button>' +
    '<img alt="">' +
    '<button class="lb-n" aria-label="Következő kép">›</button>' +
    '<p class="lb-c"></p>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), cap = box.querySelector('.lb-c');
  var cur = 0, group = imgs, x0 = null;

  function show(i) {
    cur = (i + group.length) % group.length;
    big.src = group[cur].currentSrc || group[cur].src;
    big.alt = group[cur].alt;
    cap.textContent = (cur + 1) + ' / ' + group.length;
  }
  function open(img) {
    var g = img.closest('.gal');
    group = Array.prototype.slice.call(g.querySelectorAll('img'));
    show(group.indexOf(img));
    box.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('.lb-x').focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.style.overflow = '';
  }
  imgs.forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
  });
  box.querySelector('.lb-x').addEventListener('click', close);
  box.querySelector('.lb-p').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
  box.querySelector('.lb-n').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
