const canvas = document.getElementById('fireworks');
const display = new FireworksDisplay(canvas);

const form = document.getElementById('wishForm');
const nameInput = document.getElementById('nameInput');
const overlay = document.getElementById('wishOverlay');
const wishTitle = document.getElementById('wishTitle');
const againBtn = document.getElementById('againBtn');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  // textContent safely displays the name as text, not HTML.
  wishTitle.textContent = `Happy Diwali, ${name}!`;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');

  // A little celebratory burst when the greeting appears.
  for (let i = 0; i < 7; i++) {
    setTimeout(() => display.launch(
      window.innerWidth * (0.12 + Math.random() * 0.76),
      window.innerHeight * (0.12 + Math.random() * 0.42)
    ), i * 180);
  }
});

againBtn.addEventListener('click', () => {
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  nameInput.value = '';
  nameInput.focus();
});
