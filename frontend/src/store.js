// ─────────────────────────────────────────────────────────
//  Lightweight localStorage "database" — replaces the backend
// ─────────────────────────────────────────────────────────

// ── USERS ──────────────────────────────────────────────────
const USERS_KEY = "productr_users";
const SESSION_KEY = "productr_session";
const OTP_KEY = "productr_otp";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signupUser({ name, email, password, profileImage }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const user = { id: Date.now().toString(), name, email, password, profileImage, mobile: "" };
  users.push(user);
  saveUsers(users);
  return user;
}

export function sendOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(OTP_KEY, JSON.stringify({ email, otp, expires: Date.now() + 10 * 60 * 1000 }));
  return otp; // returned so UI can show it (demo mode)
}

export function verifyOtp(email, inputOtp) {
  const raw = localStorage.getItem(OTP_KEY);
  if (!raw) throw new Error("No OTP found. Please request one first.");
  const { email: storedEmail, otp, expires } = JSON.parse(raw);
  if (storedEmail !== email) throw new Error("OTP email mismatch.");
  if (Date.now() > expires) throw new Error("OTP has expired. Please resend.");
  if (otp !== inputOtp) throw new Error("Incorrect OTP.");
  localStorage.removeItem(OTP_KEY);

  // Create session
  const users = getUsers();
  let user = users.find((u) => u.email === email);
  if (!user) {
    // Auto-create account if user signed in directly (email-only login)
    user = { id: Date.now().toString(), name: "", email, password: "", profileImage: "https://i.pravatar.cc/150", mobile: "" };
    users.push(user);
    saveUsers(users);
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(updates) {
  const user = getCurrentUser();
  if (!user) return;
  const updated = { ...user, ...updates };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  // persist to users array
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) { users[idx] = updated; saveUsers(users); }
  if (updates.profileImage) localStorage.setItem("profileImage", updates.profileImage);
  return updated;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("profileImage");
}

// ── PRODUCTS ───────────────────────────────────────────────
const PRODUCTS_KEY = "productr_products";

function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
}
function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function fetchProducts() {
  return getProducts();
}

export function addProduct(data) {
  const products = getProducts();
  const product = { ...data, _id: Date.now().toString(), isPublished: false, createdAt: new Date().toISOString() };
  products.push(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error("Product not found");
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p._id !== id);
  saveProducts(products);
}
