// Database 14 Produk
const products = [
    { id: 1, nama: "Seragam Cowo", harga: 100000, gambar: "seragam cwo.jpeg" },
    { id: 2, nama: "Celana Seragam Cowo", harga: 100000, gambar: "celana.jpeg" },
    { id: 3, nama: "Seragam Cewe", harga: 100000, gambar: "seragam cwe.jpeg" },
    { id: 4, nama: "Rok Seragam Cewe", harga: 100000, gambar: "rok.jpeg" },
    { id: 5, nama: "Almamater", harga: 150000, gambar: "almamater.jpeg" },
    { id: 6, nama: "Topi Sekolah", harga: 20000, gambar: "topi.jpeg" },
    { id: 7, nama: "Dasi Sekolah", harga: 15000, gambar: "dasi.jpeg" },
    { id: 8, nama: "Ikat Pinggang", harga: 15000, gambar: "sabuk.jpeg" },
    { id: 9, nama: "Baju Batik", harga: 100000, gambar: "batik.jpeg" },
    { id: 10, nama: "Baju Pramuka", harga: 150000, gambar: "pramuka.jpeg" },
    { id: 11, nama: "Baju Olahraga Cowo", harga: 150000, gambar: "olahraga_cwo.jpeg" },
    { id: 12, nama: "Baju Olahraga Cewe", harga: 150000, gambar: "olahraga_cwe.jpeg" },
    { id: 13, nama: "Baju Jurusan TSM", harga: 100000, gambar: "jurusan_tsm.jpeg" },
    { id: 14, nama: "Baju Jurusan RPL", harga: 100000, gambar: "jurusan_rpl.jpeg" }
];

let keranjang = [];
let selectedProduct = null;

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

// LOGIN & REGISTRASI SYSTEM
function toggleForm(type) {
    if (type === 'register') {
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-register').style.display = 'block';
    } else {
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-register').style.display = 'none';
    }
}

function prosesDaftar(e) {
    e.preventDefault();
    const regUser = document.getElementById('reg-username').value.trim();
    const regPass = document.getElementById('reg-password').value.trim();

    let daftarAkun = JSON.parse(localStorage.getItem('akunSiswa')) || [];
    if (daftarAkun.find(u => u.user === regUser)) {
        return alert("Username / NIS ini sudah terdaftar!");
    }

    daftarAkun.push({ user: regUser, pass: regPass });
    localStorage.setItem('akunSiswa', JSON.stringify(daftarAkun));

    alert("Pendaftaran berhasil! Silakan login.");
    toggleForm('login');
    document.getElementById('username').value = regUser;
}

function prosesLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    let daftarAkun = JSON.parse(localStorage.getItem('akunSiswa')) || [];
    const akunValid = daftarAkun.find(a => a.user === username && a.pass === password);

    if (akunValid) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
        document.getElementById('custName').value = username;
    } else {
        alert("Username atau Password salah! Klik 'Daftar di sini' jika belum punya akun.");
    }
}

function logout() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        document.getElementById('app-content').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// RENDER 14 PRODUK HANYA PADA HALAMAN PRODUK
function renderProducts() {
    const allGrid = document.getElementById('allProductGrid');
    let allHTML = '';

    products.forEach((p) => {
        allHTML += `
            <div class="product-card">
                <div class="img-placeholder">
                    <img src="${p.gambar}" alt="${p.nama}" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="p-info">
                    <div class="p-title">${p.nama}</div>
                    <div class="p-price">Rp. ${p.harga.toLocaleString('id-ID')}</div>
                    <button class="btn-detail-link" onclick="bukaDetail(${p.id})">Lihat Detail</button>
                    <button class="btn-gold-card" onclick="tambahLangsung(${p.id})">+ Keranjang</button>
                </div>
            </div>
        `;
    });

    allGrid.innerHTML = allHTML;
}

// NAVIGASI
function navigate(pageId) {
    // Jika akses menu "Lihat Detail" langsung via navbar tanpa memilih produk, tampilkan produk pertama secara otomatis
    if (pageId === 'detail' && !selectedProduct) {
        bukaDetail(products[0].id);
        return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    const navElement = document.getElementById('nav-' + pageId);
    if (navElement) navElement.classList.add('active');
}

// DETAIL PRODUK & UKURAN
function bukaDetail(productId) {
    selectedProduct = products.find(p => p.id === productId);
    document.getElementById('detailImg').src = selectedProduct.gambar;
    document.getElementById('detailTitle').innerText = selectedProduct.nama;
    document.getElementById('detailPrice').innerText = `Rp. ${selectedProduct.harga.toLocaleString('id-ID')}`;
    document.getElementById('detailSizeSelect').value = 'M';

    const radios = document.getElementsByName('ukuran');
    radios.forEach(r => r.checked = (r.value === 'M'));

    navigate('detail');
}

function syncSize(val) {
    document.getElementById('detailSizeSelect').value = val;
}

function tambahKeKeranjangDariDetail() {
    const ukuran = document.getElementById('detailSizeSelect').value;
    keranjang.push({ ...selectedProduct, ukuran: ukuran });
    updateCartUI();
    alert(`${selectedProduct.nama} (Ukuran ${ukuran}) ditambahkan ke keranjang!`);
}

function tambahLangsung(productId) {
    const prod = products.find(p => p.id === productId);
    keranjang.push({ ...prod, ukuran: 'M' });
    updateCartUI();
    alert(`${prod.nama} (Ukuran M) ditambahkan ke keranjang!`);
}

// UPDATE KERANJANG
function updateCartUI() {
    document.getElementById('cartBadge').innerText = keranjang.length;
    const tbody = document.getElementById('cartTableBody');
    let total = 0;

    if (keranjang.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Keranjang Anda Kosong</td></tr>`;
    } else {
        let html = '';
        keranjang.forEach((item, idx) => {
            total += item.harga;
            html += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.ukuran}</td>
                    <td>Rp. ${item.harga.toLocaleString('id-ID')}</td>
                    <td><button onclick="hapusItem(${idx})" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">Hapus</button></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
    document.getElementById('cartTotal').innerText = total.toLocaleString('id-ID');
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    updateCartUI();
}

// CARI PRODUK
function cariProduk() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#allProductGrid .product-card');

    cards.forEach(card => {
        const title = card.querySelector('.p-title').innerText.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
    });

    if (!document.getElementById('produk').classList.contains('active')) {
        navigate('produk');
    }
}

// CHECKOUT WHATSAPP
function checkout(e) {
    e.preventDefault();
    if (keranjang.length === 0) return alert('Keranjang belanja Anda kosong!');
    
    const nama = document.getElementById('custName').value;
    const kelas = document.getElementById('custClass').value;
    
    let total = 0;
    let daftarPesanan = '';

    keranjang.forEach((item, i) => {
        total += item.harga;
        daftarPesanan += `${i + 1}. ${item.nama} (Ukuran: ${item.ukuran}) - Rp. ${item.harga.toLocaleString('id-ID')}\n`;
    });

    const pesan = `Halo Admin Koperasi SMK Muthia Harapan Cicalengka,\nSaya ingin memesan:\n\n*Nama:* ${nama}\n*Kelas:* ${kelas}\n\n*Rincian Pesanan:*\n${daftarPesanan}\n*Total Pembayaran:* Rp. ${total.toLocaleString('id-ID')}`;
    const nomorAdmin = "62895402541345"; 

    window.open(`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`, '_blank');
}