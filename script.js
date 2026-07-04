// Khởi tạo dữ liệu từ LocalStorage
let inventory = JSON.parse(localStorage.getItem('myInventory')) || [];

// --- CHỨC NĂNG ĐĂNG NHẬP ---
function checkLogin() {
    const pass = document.getElementById('pass-input').value;
    if (pass === "admin") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        renderInventory();
    } else {
        alert("Sai mật khẩu! Vui lòng thử lại.");
        document.getElementById('pass-input').value = ''; // Xóa ô mật khẩu
    }
}

// --- HIỂN THỊ DANH SÁCH & THỐNG KÊ ---
function renderInventory(data = inventory) {
    const list = document.getElementById('inventory-list');
    
    // [MỚI] Cập nhật số liệu thống kê
    document.getElementById('total-count').innerText = data.length;

    // Tạo HTML cho từng sản phẩm
    list.innerHTML = data.map((item, index) => `
        <div class="item-card">
            <img src="${item.img}" class="item-img" onclick="showModal(this.src)" alt="${item.name}">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">Mã: ${item.code} | Vị trí: ${item.loc}</div>
            </div>
            <button onclick="deleteItem(${index})" class="btn-delete">🗑️ Xóa</button>
        </div>
    `).join('');
}

// --- CÁC CHỨC NĂNG KHÁC ---

// Thêm sản phẩm mới
function addItem() {
    const name = document.getElementById('name').value;
    const code = document.getElementById('code').value;
    const loc = document.getElementById('loc').value;
    const fileInput = document.getElementById('img-input');

    if (!name || !code || !loc) {
        alert("Vui lòng điền đầy đủ Tên, Mã và Vị trí!");
        return;
    }
    if (!fileInput.files[0]) {
        alert("Vui lòng chọn hình ảnh!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        inventory.push({
            name: name,
            code: code,
            loc: loc,
            img: e.target.result // Lưu ảnh dưới dạng Base64
        });
        saveAndRender();
        resetForm();
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// Xóa sản phẩm
function deleteItem(index) {
    if (confirm("Bạn có chắc chắn muốn xóa phụ tùng này?")) {
        inventory.splice(index, 1);
        saveAndRender();
    }
}

// Tìm kiếm
function filterItems() {
    const term = document.getElementById('search').value.toLowerCase();
    const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.code.toLowerCase().includes(term)
    );
    renderInventory(filtered);
}

// Hiển thị/Ẩn form thêm mới
function toggleForm() {
    const f = document.getElementById('form-container');
    f.style.display = (f.style.display === 'none' || f.style.display === '') ? 'block' : 'none';
    const btn = document.getElementById('add-btn');
    btn.innerText = (f.style.display === 'block') ? '➖ Hủy thêm' : '➕ Thêm phụ tùng';
}

// Reset form sau khi thêm
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('code').value = '';
    document.getElementById('loc').value = '';
    document.getElementById('img-input').value = '';
    toggleForm(); // Ẩn form đi
}

// Lưu vào LocalStorage và cập nhật hiển thị
function saveAndRender() {
    localStorage.setItem('myInventory', JSON.stringify(inventory));
    renderInventory();
}

// --- CHỨC NĂNG ĐỒNG BỘ DỮ LIỆU ---

// Xuất ra file JSON
function exportData() {
    if (inventory.length === 0) { alert("Kho trống, không có gì để xuất!"); return; }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inventory));
    const downNode = document.createElement('a');
    downNode.setAttribute("href", dataStr);
    downNode.setAttribute("download", "kho_phu_tung_" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(downNode);
    downNode.click();
    downNode.remove();
}

// Nhập từ file JSON
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            inventory = JSON.parse(e.target.result);
            saveAndRender();
            alert('Đã nhập dữ liệu thành công!');
        } catch (err) {
            alert('Lỗi khi đọc file. Vui lòng đảm bảo đó là file .json hợp lệ.');
        }
    };
    reader.readAsText(file);
}

// --- [MỚI] CHỨC NĂNG PHÓNG TO ẢNH ---
function showModal(imgSrc) {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('fullImg');
    modal.style.display = "block";
    modalImg.src = imgSrc;
}
