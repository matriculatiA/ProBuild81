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
