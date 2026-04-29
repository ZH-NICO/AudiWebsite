import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
document.documentElement.classList.add('js-ready');
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const storageKeys = { cart: 'audiMotionCart' };
const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value && !value.includes('DEINE_') && !value.includes('DEIN_PROJEKT'));
const auth = hasFirebaseConfig ? getAuth(initializeApp(firebaseConfig)) : null;
let currentUser = null;
let activeCartKey = `${storageKeys.cart}:guest`;

const panel = document.getElementById('account-panel');
const profileButton = document.getElementById('profile-button');
const authForms = document.getElementById('auth-forms');
const accountState = document.getElementById('account-state');
const accountName = document.getElementById('account-name');
const accountEmail = document.getElementById('account-email');
const authMessage = document.getElementById('auth-message');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const cartClear = document.getElementById('cart-clear');

if (
  !panel ||
  !profileButton ||
  !authForms ||
  !accountState ||
  !accountName ||
  !accountEmail ||
  !authMessage ||
  !cartItems ||
  !cartTotal ||
  !cartCount ||
  !(loginForm instanceof HTMLFormElement) ||
  !(registerForm instanceof HTMLFormElement) ||
  !(logoutButton instanceof HTMLButtonElement) ||
  !(cartClear instanceof HTMLButtonElement)
) {
  throw new Error('Die gemeinsame Audi Kontoleiste konnte nicht initialisiert werden.');
}

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const normalizeEmail = (email) => email.trim().toLowerCase();
const getCart = () => readJson(activeCartKey, []);
const setCart = (cart) => writeJson(activeCartKey, cart);

const showMessage = (message) => {
  authMessage.textContent = message;
};

const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
}).format(amount);

const parsePrice = (priceText) => {
  const digits = priceText.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
};

const openPanel = () => {
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
};

const closePanel = () => {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
};

const getFirebaseErrorMessage = (error) => {
  const messages = {
    'auth/email-already-in-use': 'Dieses Konto existiert bereits. Bitte melde dich an.',
    'auth/invalid-email': 'Diese E-Mail-Adresse ist ungültig.',
    'auth/invalid-credential': 'Login fehlgeschlagen. Prüfe E-Mail und Passwort.',
    'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen haben.'
  };
  return messages[error.code] || 'Firebase konnte die Anmeldung nicht abschliessen.';
};

const renderAccount = () => {
  const profileLabel = profileButton.querySelector('.profile-label');
  if (!profileLabel) return;

  if (currentUser) {
    authForms.hidden = true;
    accountState.hidden = false;
    const displayName = currentUser.displayName || 'Audi Kunde';
    accountName.textContent = displayName;
    accountEmail.textContent = currentUser.email || '';
    profileLabel.textContent = displayName.split(' ')[0] || 'Profil';
  } else {
    authForms.hidden = false;
    accountState.hidden = true;
    accountName.textContent = 'Gast';
    accountEmail.textContent = '';
    profileLabel.textContent = 'Profil';
  }
};

const renderCart = () => {
  const cart = getCart();
  cartCount.textContent = String(cart.length);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Dein Warenkorb ist leer. Öffne ein Modell und füge es hinzu.</p>';
    cartTotal.textContent = '0 €';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div><strong>${item.name}</strong><span>${item.priceText}</span></div>
      <button type="button" class="cart-remove" data-remove-cart="${item.id}">Entfernen</button>
    </article>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatCurrency(total);
};

const addCartButtons = () => {
  document.querySelectorAll('.page-car').forEach((section) => {
    const cta = section.querySelector('.car-cta');
    const title = section.querySelector('.car-detail-info h1');
    const price = section.querySelector('.tag-price');

    if (!cta || !title || !price || cta.querySelector('[data-add-cart]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.dataset.addCart = section.id;
    button.dataset.name = title.textContent.replace(/\s+/g, ' ').trim();
    button.dataset.priceText = price.textContent.trim();
    button.dataset.price = String(parsePrice(price.textContent));
    button.textContent = 'In den Warenkorb';
    cta.prepend(button);
  });
};

const addToCart = (button) => {
  const cart = getCart();
  const item = {
    id: button.dataset.addCart,
    name: button.dataset.name,
    priceText: button.dataset.priceText,
    price: Number(button.dataset.price || '0')
  };

  if (!cart.some((entry) => entry.id === item.id)) {
    cart.push(item);
  }

  setCart(cart);
  renderCart();
  showMessage(`${item.name} wurde in den Warenkorb gelegt.`);
  openPanel();
};

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const cartButton = target.closest('[data-add-cart]');
  if (cartButton instanceof HTMLButtonElement) {
    addToCart(cartButton);
  }

  const removeButton = target.closest('[data-remove-cart]');
  if (removeButton instanceof HTMLButtonElement) {
    setCart(getCart().filter((item) => item.id !== removeButton.dataset.removeCart));
    renderCart();
  }

  if (target.matches('[data-account-close]')) {
    closePanel();
  }
});

profileButton.addEventListener('click', () => {
  renderAccount();
  renderCart();
  openPanel();
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!auth) {
    showMessage('Firebase ist vorbereitet. Trage zuerst deine echten Werte in firebase-config.js ein.');
    return;
  }

  const nameField = document.getElementById('register-name');
  const emailField = document.getElementById('register-email');
  const passwordField = document.getElementById('register-password');

  if (!(nameField instanceof HTMLInputElement) || !(emailField instanceof HTMLInputElement) || !(passwordField instanceof HTMLInputElement)) {
    return;
  }

  const name = nameField.value.trim();
  const email = normalizeEmail(emailField.value);
  const password = passwordField.value;

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    registerForm.reset();
    showMessage('Konto mit Firebase erstellt und angemeldet.');
  } catch (error) {
    showMessage(getFirebaseErrorMessage(error));
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!auth) {
    showMessage('Firebase ist vorbereitet. Trage zuerst deine echten Werte in firebase-config.js ein.');
    return;
  }

  const emailField = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');

  if (!(emailField instanceof HTMLInputElement) || !(passwordField instanceof HTMLInputElement)) {
    return;
  }

  const email = normalizeEmail(emailField.value);
  const password = passwordField.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
    showMessage('Erfolgreich mit Firebase angemeldet.');
  } catch (error) {
    showMessage(getFirebaseErrorMessage(error));
  }
});

logoutButton.addEventListener('click', async () => {
  if (auth) {
    await signOut(auth);
  }

  currentUser = null;
  activeCartKey = `${storageKeys.cart}:guest`;
  showMessage('Du wurdest abgemeldet.');
  renderAccount();
  renderCart();
});

cartClear.addEventListener('click', () => {
  setCart([]);
  renderCart();
});

addCartButtons();

/* ── Mobile Menu ────────────────────────────────── */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
    mobileMenu.classList.toggle('is-open', !isOpen);
  });
  mobileMenu.querySelectorAll('.mobile-menu-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('is-open');
    });
  });
}

/* ── Scroll Reveal ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    activeCartKey = user ? `${storageKeys.cart}:${user.uid}` : `${storageKeys.cart}:guest`;
    renderAccount();
    renderCart();
  });
} else {
  showMessage('Firebase-Konfiguration fehlt noch in firebase-config.js.');
  renderAccount();
  renderCart();
}
