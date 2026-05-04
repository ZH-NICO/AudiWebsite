import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
document.documentElement.classList.add('js-ready');
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const storageKeys = {
  cart: 'audiMotionCart',
  purchase: 'audiMotionPurchase'
};
const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value && !value.includes('DEINE_') && !value.includes('DEIN_PROJEKT'));
const app = initializeApp(firebaseConfig);
const auth = hasFirebaseConfig ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();
let currentUser = null;
let activeCartKey = `${storageKeys.cart}:guest`;

const panel = document.getElementById('account-panel');
const profileButton = document.getElementById('profile-button');
const authForms = document.getElementById('auth-forms');
const accountState = document.getElementById('account-state');
const accountName = document.getElementById('account-name');
const accountEmail = document.getElementById('account-email');
const authMessage = document.getElementById('auth-message');
const cartPanel = document.querySelector('.cart-panel');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const logoutButton = document.getElementById('logout-button');
const cartClear = document.getElementById('cart-clear');
const checkoutButton = document.getElementById('checkout-button');
const receiptPanel = document.getElementById('receipt-panel');
const receiptOrderNumber = document.getElementById('receipt-order-number');
const receiptDate = document.getElementById('receipt-date');
const receiptCustomerName = document.getElementById('receipt-customer-name');
const receiptCustomerEmail = document.getElementById('receipt-customer-email');
const receiptItems = document.getElementById('receipt-items');
const receiptTotal = document.getElementById('receipt-total');
const receiptContinue = document.getElementById('receipt-continue');

if (
  !panel ||
  !profileButton ||
  !authForms ||
  !accountState ||
  !accountName ||
  !accountEmail ||
  !authMessage ||
  !cartPanel ||
  !cartItems ||
  !cartTotal ||
  !cartCount ||
  !(logoutButton instanceof HTMLButtonElement) ||
  !(cartClear instanceof HTMLButtonElement) ||
  !(checkoutButton instanceof HTMLButtonElement) ||
  !receiptPanel ||
  !receiptOrderNumber ||
  !receiptDate ||
  !receiptCustomerName ||
  !receiptCustomerEmail ||
  !receiptItems ||
  !receiptTotal ||
  !(receiptContinue instanceof HTMLButtonElement)
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

const formatPurchaseDate = (date) => new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'full',
  timeStyle: 'short'
}).format(date);

const parsePrice = (priceText) => {
  const digits = priceText.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
};

const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomPart = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `AUDI-${year}${month}${day}-${randomPart}`;
};

const openPanel = () => {
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
};

const closePanel = () => {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
};

const showCartView = () => {
  cartPanel.hidden = false;
  receiptPanel.hidden = true;
};

const showReceiptView = (purchase) => {
  receiptOrderNumber.textContent = purchase.orderNumber;
  receiptDate.textContent = purchase.dateText;
  receiptCustomerName.textContent = purchase.customerName;
  receiptCustomerEmail.textContent = purchase.customerEmail;
  receiptItems.innerHTML = purchase.items.map((item) => `
    <article class="receipt-item">
      <div>
        <strong>${item.name}</strong>
        <span>Fahrzeugpreis</span>
      </div>
      <strong>${item.priceText}</strong>
    </article>
  `).join('');
  receiptTotal.textContent = formatCurrency(purchase.total);
  cartPanel.hidden = true;
  receiptPanel.hidden = false;
};

const completePurchase = () => {
  const cart = getCart();

  if (!cart.length) {
    return;
  }

  if (!currentUser) {
    showMessage('Bitte melde dich zuerst mit Google an.');
    return;
  }

  const now = new Date();
  const purchase = {
    orderNumber: generateOrderNumber(),
    createdAt: now.toISOString(),
    dateText: formatPurchaseDate(now),
    customerName: currentUser.displayName || 'Audi Kunde',
    customerEmail: currentUser.email || 'Keine E-Mail hinterlegt',
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price, 0)
  };

  writeJson(storageKeys.purchase, purchase);
  setCart([]);
  renderCart();
  showReceiptView(purchase);
  showMessage(`Bestellung ${purchase.orderNumber} erfolgreich abgeschlossen.`);
};

const getFirebaseErrorMessage = (error) => {
  const messages = {
    'auth/popup-closed-by-user': 'Google-Anmeldung abgebrochen.',
    'auth/account-exists-with-different-credential': 'Dieses Google-Konto ist bereits mit einer anderen Anmeldemethode verknüpft.',
    'auth/cancelled-popup-request': 'Anmeldung abgebrochen.',
    'auth/unauthorized-domain': 'Diese Domain ist nicht in Firebase autorisiert. Ergänze sie in der Firebase Console unter Authentication > Settings.'
  };
  return messages[error.code] || 'Firebase konnte die Anmeldung nicht abschliessen.';
};

const renderAccount = () => {
  const profileLabel = profileButton.querySelector('.profile-label');
  const profileAvatar = profileButton.querySelector('.profile-avatar');
  if (!profileLabel) return;

  if (currentUser) {
    authForms.hidden = true;
    accountState.hidden = false;
    const displayName = currentUser.displayName || 'Audi Kunde';
    accountName.textContent = displayName;
    accountEmail.textContent = currentUser.email || '';
    profileLabel.textContent = displayName.split(' ')[0] || 'Profil';

    if (profileAvatar) {
      if (currentUser.photoURL) {
        profileAvatar.innerHTML = '<img src="' + currentUser.photoURL + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
      } else {
        const initial = (displayName || 'A').charAt(0).toUpperCase();
        profileAvatar.innerHTML = '';
        profileAvatar.textContent = initial;
        profileAvatar.style.background = 'linear-gradient(135deg, var(--accent), #ff4d6a)';
        profileAvatar.style.color = '#fff';
        profileAvatar.style.fontWeight = '700';
        profileAvatar.style.fontSize = '0.85rem';
      }
    }
  } else {
    authForms.hidden = false;
    accountState.hidden = true;
    accountName.textContent = 'Gast';
    accountEmail.textContent = '';
    profileLabel.textContent = 'Profil';
    if (profileAvatar) {
      profileAvatar.innerHTML = '';
      profileAvatar.textContent = '👤';
      profileAvatar.style.background = '';
      profileAvatar.style.color = '';
      profileAvatar.style.fontWeight = '';
      profileAvatar.style.fontSize = '';
    }
  }
};

const renderCart = () => {
  const cart = getCart();
  cartCount.textContent = String(cart.length);
  checkoutButton.disabled = cart.length === 0;

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
  showCartView();
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

/* ── Google Sign-In ──────────────────────────────── */
const googleSignInBtn = document.getElementById('google-signin-btn');
if (googleSignInBtn) {
  googleSignInBtn.addEventListener('click', async () => {
    if (!auth) {
      showMessage('Firebase ist vorbereitet. Trage zuerst deine echten Werte in firebase-config.js ein.');
      return;
    }
    try {
      googleSignInBtn.disabled = true;
      googleSignInBtn.textContent = 'Anmeldung läuft…';
      await signInWithPopup(auth, googleProvider);
      showMessage('Erfolgreich mit Google angemeldet.');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        showMessage('');
      } else {
        showMessage(getFirebaseErrorMessage(error));
      }
    } finally {
      googleSignInBtn.disabled = false;
      const svg = '<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
      googleSignInBtn.innerHTML = svg + ' Mit Google anmelden';
    }
  });
}

logoutButton.addEventListener('click', async () => {
  if (auth) {
    await signOut(auth);
  }

  currentUser = null;
  activeCartKey = `${storageKeys.cart}:guest`;
  showCartView();
  showMessage('Du wurdest abgemeldet.');
  renderAccount();
  renderCart();
});

cartClear.addEventListener('click', () => {
  setCart([]);
  renderCart();
});

checkoutButton.addEventListener('click', () => {
  completePurchase();
});

receiptContinue.addEventListener('click', () => {
  showCartView();
  showMessage('Du kannst weitere Fahrzeuge in den Warenkorb legen.');
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

/* ── Category Filter ──────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const carSections = document.querySelectorAll('.page-car[data-category]');

if (filterBtns.length && carSections.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      carSections.forEach((section) => {
        const match = filter === 'all' || section.dataset.category === filter;
        section.classList.toggle('filter-hidden', !match);
      });
    });
  });
}

if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    activeCartKey = user ? `${storageKeys.cart}:${user.uid}` : `${storageKeys.cart}:guest`;
    showCartView();
    renderAccount();
    renderCart();
  });
} else {
  showMessage('Firebase-Konfiguration fehlt noch in firebase-config.js.');
  showCartView();
  renderAccount();
  renderCart();
}
