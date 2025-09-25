const API_URL = "http://localhost:5000/api"; // Change for deployment

/* ========== AUTH ========== */
function signup(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Signup successful!");
      window.location.href = "login.html";
    } else {
      alert(data.msg);
    }
  });
}

function login(e) {
  e.preventDefault();
  const email = document.getElementById("lemail").value;
  const password = document.getElementById("lpassword").value;

  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert(data.msg);
    }
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

/* ========== CONTACT FORM ========== */
function saveMessage(e) {
  e.preventDefault();
  const name = document.getElementById("cname").value;
  const email = document.getElementById("cemail").value;
  const text = document.getElementById("ctext").value;

  fetch(`${API_URL}/message/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, text })
  })
  .then(res => res.json())
  .then(data => alert(data.msg));
}

/* ========== CART ========== */
function addToCart(product, price) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Login required!");
    return;
  }

  fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user._id, product, price })
  })
  .then(res => res.json())
  .then(() => alert(`${product} added to cart`));
}

function loadCart() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  fetch(`${API_URL}/cart/${user._id}`)
    .then(res => res.json())
    .then(cart => {
      let table = document.getElementById("cartTable");
      let total = 0;
      table.innerHTML = `<tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Action</th></tr>`;

      (cart.items || []).forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        let row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.product}</td>
          <td>₹${item.price}</td>
          <td>${item.quantity}</td>
          <td>₹${itemTotal}</td>
          <td><button class="remove-btn" onclick="removeFromCart('${item.product}')">Remove</button></td>
        `;
        table.appendChild(row);
      });

      document.getElementById("cartTotal").innerText = "Total: ₹" + total;
    });
}

function removeFromCart(product) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user._id, product })
  })
  .then(() => loadCart());
}

function checkout(e) {
  e.preventDefault();
  const name = document.getElementById("checkoutName").value;
  const address = document.getElementById("checkoutAddress").value;
  const payment = document.getElementById("checkoutPayment").value;

  if (!payment) return alert("Select a payment method.");

  alert(`Order placed successfully! Thank you, ${name}`);
  // Optional: clear cart from backend
}

/* ========== ADMIN ========== */
function loadUsers() {
  fetch(`${API_URL}/auth/users`)
    .then(res => res.json())
    .then(users => {
      const table = document.getElementById("userTable");
      table.innerHTML = `<tr><th>Name</th><th>Email</th><th>Plan</th><th>Action</th></tr>`;

      users.forEach(u => {
        let row = document.createElement("tr");
        row.innerHTML = `
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.plan}</td>
          <td><button class="remove-btn" onclick="deleteUser('${u._id}')">Delete</button></td>
        `;
        table.appendChild(row);
      });
    });
}

function deleteUser(id) {
  fetch(`${API_URL}/auth/users/${id}`, { method: "DELETE" })
    .then(() => loadUsers());
}

/* ========== AUTO INIT ========== */
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && document.getElementById("userName")) {
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userEmail").innerText = user.email;
    document.getElementById("userPlan").innerText = user.plan || "No plan selected";
  }

  if (document.getElementById("cartTable")) loadCart();
  if (document.getElementById("userTable")) loadUsers();
};
