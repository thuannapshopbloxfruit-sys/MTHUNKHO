let inventory = JSON.parse(localStorage.getItem('myInventory')) || [];

function checkLogin() {
    if (document.getElementById('pass-input').value === "admin") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        renderInventory();
    } else { alert("Sai mật khẩu!"); }
}

function renderInventory(data = inventory) {
    const list = document.getElementById('inventory-list');
    list.innerHTML = data.map((item, index) => `
        <div class="item-card">
            <img src="${item.img}" class="item-img" onclick="document.getElementById('fullImg').src='${item.img}'; document.getElementById('imgModal').style.display='block';">
            <div style="flex-grow: 1;">
                <strong>${item.name}</strong><br>
                Mã: ${item.code} | Vị trí: ${item.loc}
            </div>
            <button onclick="deleteItem(${index})" style="width: auto; background: red;">🗑️</button>
        </div>
    `).join('');
}

function addItem() {
    const fileInput = document.getElementById('img-input');
    if (!fileInput.files[0]) { alert("Vui lòng chọn ảnh!"); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        const newItem = {
            name: document.getElementById('name').value,
            code: document.getElementById('code').value,
            loc: document.getElementById('loc').value,
            img: e.target.result
        };

        try {
            inventory.push(newItem);
            // Thử lưu
            localStorage.setItem('myInventory', JSON.stringify(inventory));
            renderInventory();
            toggleForm();
            resetForm();
        } catch (err) {
            // Nếu lỗi, khả năng cao là do đầy dung lượng (QuotaExceededError)
            alert("Lỗi: Không thể lưu! Kho hàng đã đầy (do ảnh quá nặng). Vui lòng xóa bớt ảnh cũ hoặc dùng ảnh chất lượng thấp hơn.");
            inventory.pop(); // Xóa món vừa thêm lỗi ra khỏi mảng
        }
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function deleteItem(index) {
    inventory.splice(index, 1);
    localStorage.setItem('myInventory', JSON.stringify(inventory));
    renderInventory();
}

function toggleForm() {
    const f = document.getElementById('form-container');
    f.style.display = (f.style.display === 'none') ? 'block' : 'none';
}

function filterItems() {
    const term = document.getElementById('search').value.toLowerCase();
    renderInventory(inventory.filter(i => i.name.toLowerCase().includes(term) || i.code.toLowerCase().includes(term)));
}

function exportData() {
    const data = localStorage.getItem('myInventory');
    if (!data) { alert("Kho trống!"); return; }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kho_phu_tung.json';
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('myInventory', e.target.result);
        inventory = JSON.parse(e.target.result);
        alert('Đã nhập dữ liệu thành công!');
        renderInventory();
    };
    reader.readAsText(file);
}
