// Helpers
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);
const uid = _ => 'id_' + Math.random().toString(36).slice(2, 9);

// Storage keys
const STORAGE_PRODUCTS = 'js_products_5000_demo';
const STORAGE_PROFILE = 'js_user_profile_demo';
const STORAGE_LOGINS = 'js_login_log_demo';

let currentUser = JSON.parse(localStorage.getItem(STORAGE_PROFILE) || 'null');
let products = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || '[]');
let cart = currentUser ? JSON.parse(localStorage.getItem('js_cart_' + currentUser.phone) || '[]') : [];

// Sample products
if (products.length === 0) {
  products = [
    { id: uid(), name: 'Gaon Product A', price: 100, desc: 'Special for Gaon A', image: 'https://via.placeholder.com/400x300?text=Product+A', stock: 50 },
    { id: uid(), name: 'Gaon Product B', price: 150, desc: 'Special for Gaon B', image: 'https://via.placeholder.com/400x300?text=Product+B', stock: 30 },
    { id: uid(), name: 'Gaon Product C', price: 80, desc: 'Special for Gaon C', image: 'https://via.placeholder.com/400x300?text=Product+C', stock: 20 }
  ];
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
}

// Render products
function renderProducts() {
  const container = qs('#products');
  container.innerHTML = '';
  const search = qs('#search').value.trim().toLowerCase();

  const list = products.filter(p =>
    p.name.toLowerCase().includes(search) || (p.desc || '').toLowerCase().includes(search)
  );

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card flip-card'; // Add flip-card class for flip effect
    card.innerHTML = `
      <img src='${p.image}'>
      <h4>${p.name}</h4>
      <div class='price'>₹${p.price}</div>
      <div class='desc'>${p.desc}</div>
      <div class='row'>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach flip effect after cards are rendered
  qsa('.flip-card').forEach(c => c.addEventListener('click', () => c.classList.toggle('touch')));
}
renderProducts();

// Cart functions
function cartKey() {
  return currentUser ? 'js_cart_' + currentUser.phone : 'js_cart_anon';
}

function saveCart() {
  localStorage.setItem(cartKey(), JSON.stringify(cart));
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return alert('Product not found');
  const existing = cart.find(c => c.id === id);
  if (existing) {
    if (existing.qty + 1 > p.stock) return alert('Stock limit');
    existing.qty += 1;
  } else {
    cart.push({ id: id, name: p.name, price: p.price, qty: 1, image: p.image });
  }
  saveCart();
  alert('Product added to cart');
}

// Profile
function updateUserDisplay() {
  qs('#user-display').innerText = currentUser ? currentUser.name : 'Guest';
  if (currentUser && currentUser.photo) {
    qs('#user-display-photo').src = currentUser.photo;
  }
}
updateUserDisplay();

// Modal handling
qs('#login-btn').addEventListener('click', () => openModal('profile'));
function openModal(modal) { qs('#'+modal+'-modal').style.display = 'flex'; }
function closeModal(modal) { qs('#'+modal+'-modal').style.display = 'none'; }

// Profile form
qs('#profile-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = qs('#u-name').value.trim();
  const phone = qs('#u-phone').value.trim();
  const email = qs('#u-email').value.trim();
  const photo = qs('#u-photo').value.trim() || 'https://i.ibb.co/rtfzYsd1';
  if (!name || !phone) return alert('Naam aur phone required');

  currentUser = { name, phone, email, photo };
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(currentUser));
  updateUserDisplay();
  alert('Login ho gaya: ' + name);
  closeModal('profile');
  cart = JSON.parse(localStorage.getItem(cartKey()) || '[]');
});

// Search input
qs('#search').addEventListener('input', renderProducts);
