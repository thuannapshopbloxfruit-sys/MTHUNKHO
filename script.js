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
            <img src="${item.img}" class="item-img">
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
        inventory.push({
            name: document.getElementById('name').value,
            code: document.getElementById('code').value,
            loc: document.getElementById('loc').value,
            img: e.target.result
        });
        localStorage.setItem('myInventory', JSON.stringify(inventory));
        renderInventory();
        toggleForm(); // Đóng form sau khi lưu
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