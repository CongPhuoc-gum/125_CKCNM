/* LẤY ID TỪ LARAVEL (đã được set trong blade template) */
const id = window.productId || 1;

const product = products.find(p => p.id === id);

if (!product) {
  document.body.innerHTML = "<h2>❌ Không tìm thấy sản phẩm</h2>";
  throw new Error("Product not found");
}

/* RENDER DỮ LIỆU */
document.getElementById("breadcrumb").innerHTML =
  `Trang chủ / Sản phẩm / <strong>${product.name}</strong>`;

document.getElementById("name").innerText = product.name;
document.getElementById("price").innerText = product.price.toLocaleString() + "₫";
document.getElementById("unit").innerText = product.unit;
document.getElementById("desc").innerText = product.desc;

document.getElementById("rating").innerHTML =
  "★★★★★ " + `<span>(${product.rating} – ${product.reviews} đánh giá)</span>`;

if (product.oldPrice) {
  document.getElementById("oldPrice").innerText =
    product.oldPrice.toLocaleString() + "₫";
}

/* INFO GRID */
document.getElementById("info").innerHTML = `
  <div class="info-box">📦 Tình trạng: <strong>${product.status}</strong></div>
  <div class="info-box">🏷 Thương hiệu: <strong>${product.brand}</strong></div>
  <div class="info-box">🚚 Giao hàng: <strong>${product.shipping}</strong></div>
  <div class="info-box">⏱ Thời gian: <strong>${product.time}</strong></div>
`;

/* IMAGES */
const thumbs = document.getElementById("thumbs");
document.getElementById("mainImg").src = product.images[0];

product.images.forEach((src, i) => {
  const img = document.createElement("img");
  img.src = src;
  if (i === 0) img.classList.add("active");

  img.onclick = () => {
    document.getElementById("mainImg").src = src;
    document.querySelectorAll(".thumbs img")
      .forEach(i => i.classList.remove("active"));
    img.classList.add("active");
  };
  thumbs.appendChild(img);
});

/* QTY */
function changeQty(n) {
  const q = document.getElementById("qty");
  q.value = Math.max(1, parseInt(q.value) + n);
}