document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

const toast = document.getElementById('toast');
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

const quoteForm = document.getElementById('quoteForm');
quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Благодарим ви! Ще се свържем с вас до 24 часа.');
  quoteForm.reset();
});

// Sticky header shadow on scroll
const siteHeader = document.querySelector('.site-header');
const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Hero search bar: prefill the quote form and jump to it
const heroSearchForm = document.getElementById('heroSearchForm');
const quoteServiceSelect = quoteForm.querySelector('select[name="service"]');
const quoteCitySelect = quoteForm.querySelector('input[name="city"]');

function prefillQuoteForm(service, city) {
  if (service) quoteServiceSelect.value = service;
  if (city) quoteCitySelect.value = city;
}

heroSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const service = heroSearchForm.querySelector('select[name="service"]').value;
  const city = heroSearchForm.querySelector('input[name="city"]').value;
  prefillQuoteForm(service, city);
  document.getElementById('kontakti').scrollIntoView({ behavior: 'smooth' });
});

// Category strip: prefill the service and jump to the quote form
document.querySelectorAll('.category-item[data-service]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    prefillQuoteForm(item.dataset.service, '');
    document.getElementById('kontakti').scrollIntoView({ behavior: 'smooth' });
  });
});

// Service cards already link to #kontakti; prefill on click too
document.querySelectorAll('.service-card[data-service], .offer-card[data-service]').forEach(card => {
  card.addEventListener('click', () => prefillQuoteForm(card.dataset.service, ''));
});

// Before/after slider
const baSlider = document.getElementById('baSlider');
if (baSlider) {
  const baRange = document.getElementById('baRange');
  const baBefore = document.getElementById('baBefore');
  const baDivider = document.getElementById('baDivider');
  let demoTimer = null;

  function setBaPos(val, animate) {
    baBefore.classList.toggle('ba-animate', animate);
    baDivider.classList.toggle('ba-animate', animate);
    baRange.value = val;
    baBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    baDivider.style.left = val + '%';
  }

  function stopBaDemo() {
    if (demoTimer) clearTimeout(demoTimer);
    demoTimer = null;
    baBefore.classList.remove('ba-animate');
    baDivider.classList.remove('ba-animate');
  }

  function runBaDemo() {
    const steps = [50, 22, 78, 50];
    let i = 0;
    const step = () => {
      i++;
      if (i >= steps.length) return;
      setBaPos(steps[i], true);
      demoTimer = setTimeout(step, 750);
    };
    demoTimer = setTimeout(step, 500);
  }

  setBaPos(50, false);
  baRange.addEventListener('input', () => {
    stopBaDemo();
    setBaPos(baRange.value, false);
  });

  // Tap or click anywhere on the image to jump the slider there, drag to move it
  function posFromEvent(e) {
    const rect = baSlider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    return Math.min(100, Math.max(0, (x / rect.width) * 100));
  }
  let dragging = false;
  baSlider.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    stopBaDemo();
    dragging = true;
    setBaPos(posFromEvent(e), false);
    baSlider.setPointerCapture(e.pointerId);
  });
  baSlider.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setBaPos(posFromEvent(e), false);
  });
  baSlider.addEventListener('pointerup', () => { dragging = false; });
  baSlider.addEventListener('pointercancel', () => { dragging = false; });

  if ('IntersectionObserver' in window) {
    const baIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runBaDemo();
          baIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    baIo.observe(baSlider);
  } else {
    runBaDemo();
  }
}

// Category strip: hide the scroll-sideways hint once the user reaches the end
const categoryRow = document.querySelector('.category-row');
const categoryHint = document.querySelector('.category-scroll-hint');
if (categoryRow && categoryHint) {
  if (categoryRow.scrollWidth <= categoryRow.clientWidth + 4) {
    categoryHint.style.display = 'none';
  } else {
    categoryRow.addEventListener('scroll', () => {
      const atEnd = categoryRow.scrollLeft + categoryRow.clientWidth >= categoryRow.scrollWidth - 8;
      categoryHint.classList.toggle('is-hidden', atEnd);
    }, { passive: true });
  }
}

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}
