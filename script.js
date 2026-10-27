/* Tiny cart logic shared by all pages */
const PRICE = 1334, TAX = 0.05;
let cart, discountRate = 0;

function load() {
  try { cart = JSON.parse(localStorage.getItem("thala7cart")); } catch (e) {}
  if (!Array.isArray(cart)) cart = [{ qty: 1 }, { qty: 1 }, { qty: 1 }];
  try { discountRate = Number(localStorage.getItem("thala7disc")) || 0; } catch (e) {}
}
function save() {
  try { localStorage.setItem("thala7cart", JSON.stringify(cart)); localStorage.setItem("thala7disc", discountRate); } catch (e) {}
}
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const $ = id => document.getElementById(id);

function totals() {
  const items = cart.reduce((s, i) => s + i.qty, 0);
  const sub = items * PRICE, disc = sub * discountRate, tax = (sub - disc) * TAX;
  return { items, sub, disc, tax, total: sub - disc + tax };
}
function render() {
  const t = totals();
  if ($("cart-count")) $("cart-count").textContent = t.items;
  if ($("sub")) {
    $("sub").textContent = inr(t.sub); $("tax").textContent = inr(t.tax);
    $("disc").textContent = inr(t.disc); $("total").textContent = inr(t.total);
    document.querySelectorAll(".pay-total").forEach(e => e.textContent = inr(t.total));
  }
  const body = $("cart-body");
  if (body) {
    body.innerHTML = cart.map((it, i) => `<tr>
      <td>Seven By M.S.Dhoni W...</td>
      <td><span class="qty-ctl"><button data-d="-1" data-i="${i}">−</button>${it.qty}<button data-d="1" data-i="${i}">+</button></span></td>
      <td>${inr(it.qty * PRICE)}</td>
      <td><button class="remove" data-r="${i}" aria-label="Remove">×</button></td></tr>`).join("");
    if ($("empty-msg")) $("empty-msg").hidden = cart.length > 0;
  }
}

load();
render();

document.addEventListener("click", e => {
  const b = e.target;
  if (b.dataset && b.dataset.d) {
    const i = +b.dataset.i; cart[i].qty = Math.max(1, cart[i].qty + +b.dataset.d); save(); render();
  }
  if (b.dataset && b.dataset.r) { cart.splice(+b.dataset.r, 1); save(); render(); }
  if (b.id === "apply-coupon") {
    const code = $("coupon").value.trim().toUpperCase(), msg = $("coupon-msg");
    if (code === "THALA7") { discountRate = 0.1; msg.textContent = "Coupon applied: 10% off!"; msg.className = "coupon-msg"; }
    else { discountRate = 0; msg.textContent = "Invalid coupon. Try THALA7"; msg.className = "coupon-msg err"; }
    save(); render();
  }
  if (b.id === "add-to-cart") {
    cart.push({ qty: +$("qty").value }); save(); render();
    $("added-msg").textContent = "Added to cart ✓";
  }
  const th = b.closest && b.closest(".thumb");
  if (th) {
    $("main-img").src = th.querySelector("img").src;
    document.querySelectorAll(".thumb").forEach(x => x.classList.remove("active"));
    th.classList.add("active");
  }
  if (b.classList && b.classList.contains("method")) {
    document.querySelectorAll(".method").forEach(x => x.classList.remove("active"));
    if (!b.classList.contains("more")) b.classList.add("active");
  }
});
