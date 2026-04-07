let products = JSON.parse(localStorage.getItem("myProduct")) || [];

// let products = [
//   { id: "SP001", product_name: "Iphone 12 Pro",      category: "Điện thoại", price: 12000000, quantity: 10, discount: 0,  image: "", description: "", status: "active"   },
//   { id: "SP002", product_name: "Samsung Galaxy X20", category: "Điện thoại", price: 21000000, quantity: 100,discount: 5,  image: "", description: "", status: "inactive" },
//   { id: "SP003", product_name: "Phone 8 Plus",       category: "Điện thoại", price: 5000000,  quantity: 10, discount: 0,  image: "", description: "", status: "active"   },
//   { id: "SP004", product_name: "Iphone 14 Pro Max",  category: "Điện thoại", price: 25000000, quantity: 20, discount: 2,  image: "", description: "", status: "inactive" },
//   { id: "SP005", product_name: "Oppo X3",            category: "Điện thoại", price: 2000000,  quantity: 10, discount: 10, image: "", description: "", status: "inactive" },
//   { id: "SP006", product_name: "Iphone 16",          category: "Điện thoại", price: 20000000, quantity: 20, discount: 3,  image: "", description: "", status: "inactive" },
//   { id: "SP007", product_name: "Iphone 7 Plus",      category: "Điện thoại", price: 4000000,  quantity: 10, discount: 4,  image: "", description: "", status: "active"   },
//   { id: "SP008", product_name: "Samsung S20 Ultra",  category: "Điện thoại", price: 30000000, quantity: 15, discount: 2,  image: "", description: "", status: "inactive" },
// ];
// localStorage.setItem("myProduct", JSON.stringify(products));

const renderList     = document.getElementById('renderList');
const inputSearch    = document.getElementById('inputSearch');
const selectCategory = document.getElementById('selectCategory');
const selectStatus   = document.getElementById('selectStatus');

function getByIds(ids) {
    for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el) return el;
    }
    return null;
}

//sắp xếp
let sortField = 'product_name';
let sortOrder = 'up';

function toggleSort(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'up' ? 'desc' : 'up';
    } else {
        sortField = field;
        sortOrder = 'up';
    }

    // Cập nhật icon trên header
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.className = 'sort-icon fa-solid fa-arrow-down';
    });
    const activeIcon = document.getElementById('sort-' + field);
    if (activeIcon) {
        activeIcon.className = sortOrder === 'up'
            ? 'sort-icon fa-solid fa-arrow-down'
            : 'sort-icon fa-solid fa-arrow-up';
    }

    currentPage = 1;
    render();
}

//phan trang
const quantity = 8;
let currentPage = 1;

function getTotalPages(data) {
    return Math.ceil(data.length / quantity) || 1;
}

function getPageData(data) {
    let start = (currentPage - 1) * quantity;
    return data.slice(start, start + quantity);
}

function renderPagination(data) {
    let totalPages = getTotalPages(data);
    let container = document.getElementById('pagination');
    if (!container) return;
    container.innerHTML = '';

    let prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; render(); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            let btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; render(); };
            container.appendChild(btn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            let dots = document.createElement('button');
            dots.className = 'page-btn';
            dots.textContent = '...';
            dots.disabled = true;
            container.appendChild(dots);
        }
    }

    let next = document.createElement('button');
    next.className = 'page-btn';
    next.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { currentPage++; render(); };
    container.appendChild(next);
}


function formatPrice(price) {
    return Number(price).toLocaleString('vi-VN') + ' đ';
}

// hien thị
function render() {
    if (!renderList || !inputSearch || !selectCategory || !selectStatus) return;
    renderList.innerHTML = '';

    let key      = inputSearch.value.trim().toLowerCase();
    let catVal   = selectCategory.value;
    let statVal  = selectStatus.value;

    let filtered = products.filter(p => {
        let matchName   = p.product_name.toLowerCase().includes(key);
        let matchCat    = catVal  === 'all' || p.category === catVal;
        let matchStatus = statVal === 'all' || p.status   === statVal;
        return matchName && matchCat && matchStatus;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Số thì so sánh bằng số
        if (!isNaN(valA) && !isNaN(valB)) {
            return sortOrder === 'up' ? valA - valB : valB - valA;
        }
        // Chuỗi thì dùng localeCompare
        return sortOrder === 'up'
            ? String(valA).localeCompare(String(valB), 'vi')
            : String(valB).localeCompare(String(valA), 'vi');
    });

    let pageData = getPageData(filtered);

    pageData.forEach(p => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.product_name}</td>
            <td>${p.category}</td>
            <td>${formatPrice(p.price)}</td>
            <td>${p.quantity}</td>
            <td>${p.discount}%</td>
            <td><span class="badge ${p.status === 'active' ? 'badge-active' : 'badge-inactive'}">
                ${p.status === 'active' ? '● Đang hoạt động' : '● Ngừng hoạt động'}
            </span></td>
            <td class="actions">
                <button class="btn-delete" onclick="openModalDelete('${p.id}','${p.product_name}')">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button class="btn-edit" onclick="openModalEdit('${p.id}')">
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </td>`;
        renderList.appendChild(tr);
    });

    renderPagination(filtered);
    renderCategoryOptions(); // đồng bộ danh mục từ localStorage
}

// =========================================================
// RENDER OPTION DANH MỤC TỪ localStorage myCategory
// =========================================================
function renderCategoryOptions() {
    let categories = JSON.parse(localStorage.getItem('myCategory')) || [];
    let activeCategories = categories.filter(c => c.status === 'active');

    // Select lọc trên bảng
    let currentCatFilter = selectCategory.value;
    selectCategory.innerHTML = '<option value="all">Tất cả danh mục</option>';
    activeCategories.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c.category_name;
        opt.textContent = c.category_name;
        if (c.category_name === currentCatFilter) opt.selected = true;
        selectCategory.appendChild(opt);
    });

    // Select trong modal thêm mới
    let modalCatSelect = document.getElementById('inputCategory');
    if (modalCatSelect) {
        let prevVal = modalCatSelect.value;
        modalCatSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        activeCategories.forEach(c => {
            let opt = document.createElement('option');
            opt.value = c.category_name;
            opt.textContent = c.category_name;
            if (c.category_name === prevVal) opt.selected = true;
            modalCatSelect.appendChild(opt);
        });
    }

    // Select trong modal sửa
    let editCatSelect = document.getElementById('editCategory');
    if (editCatSelect) {
        let prevVal = editCatSelect.value;
        editCatSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        activeCategories.forEach(c => {
            let opt = document.createElement('option');
            opt.value = c.category_name;
            opt.textContent = c.category_name;
            if (c.category_name === prevVal) opt.selected = true;
            editCatSelect.appendChild(opt);
        });
    }
}

//tìm kiem
if (inputSearch) inputSearch.addEventListener('input', () => { currentPage = 1; render(); });
if (selectCategory) selectCategory.addEventListener('change', () => { currentPage = 1; render(); });
if (selectStatus) selectStatus.addEventListener('change', () => { currentPage = 1; render(); });


function openModal() {
    clearAddErrors();
    document.getElementById('inputId').value       = '';
    document.getElementById('inputName').value     = '';
    document.getElementById('inputQuantity').value = 1;
    document.getElementById('inputPrice').value    = '';
    document.getElementById('inputDiscount').value = 0;
    document.getElementById('inputImage').value    = '';
    document.getElementById('inputDesc').value     = '';
    document.querySelector('input[name="status"][value="active"]').checked = true;
    renderCategoryOptions();
    document.getElementById('inputCategory').value = '';
    const modal = getByIds(['modal']);
    const overlay = getByIds(['modalOverlay']);
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeModal() {
    const modal = getByIds(['modal']);
    const overlay = getByIds(['modalOverlay']);
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}


function validateCreate() {
    clearAddErrors();
    let check = true;

    let id       = document.getElementById('inputId').value.trim();
    let name     = document.getElementById('inputName').value.trim();
    let category = document.getElementById('inputCategory').value;
    let price    = document.getElementById('inputPrice').value.trim();
    let quantity = document.getElementById('inputQuantity').value.trim();
    let discount = document.getElementById('inputDiscount').value.trim();

    if (id === '') {
        showError(document.getElementById('inputId'), 'idErr', 'Mã sản phẩm không được để trống');
        check = false;
    } else {
        let exists = products.find(p => p.id === id);
        if (exists) {
            showError(document.getElementById('inputId'), 'idErr', 'Mã sản phẩm đã tồn tại');
            check = false;
        }
    }

    if (name === '') {
        showError(document.getElementById('inputName'), 'nameErr', 'Tên sản phẩm không được để trống');
        check = false;
    }

    if (category === '') {
        showError(document.getElementById('inputCategory'), 'categoryErr', 'Vui lòng chọn danh mục');
        check = false;
    }

    if (price === '' || isNaN(price) || Number(price) < 0) {
        showError(document.getElementById('inputPrice'), 'priceErr', 'Giá không hợp lệ');
        check = false;
    }

    if (quantity === '' || isNaN(quantity) || Number(quantity) < 0) {
        showError(document.getElementById('inputQuantity'), 'quantityErr', 'Số lượng không hợp lệ');
        check = false;
    }

    if (discount === '' || isNaN(discount) || Number(discount) < 0 || Number(discount) > 100) {
        showError(document.getElementById('inputDiscount'), 'discountErr', 'Giảm giá phải từ 0 đến 100');
        check = false;
    }

    if (check) {
        createProduct();
        closeModal();
    }
}
//thêm mới
function createProduct() {
    let status = document.querySelector('input[name="status"]:checked').value;

    let newProduct = {
        id: document.getElementById('inputId').value.trim(),
        product_name: document.getElementById('inputName').value.trim(),
        category: document.getElementById('inputCategory').value,
        price: +(document.getElementById('inputPrice').value),
        quantity: +(document.getElementById('inputQuantity').value),
        discount: +(document.getElementById('inputDiscount').value),
        image: document.getElementById('inputImage').value.trim(),
        description: document.getElementById('inputDesc').value.trim(),
        status: status
    };

    products.push(newProduct);
    currentPage = getTotalPages(products);
    localStorage.setItem('myProduct', JSON.stringify(products));
    render();
}


let delId = '';

function openModalDelete(id, name) {
    delId = id;
    const deleteName = getByIds(['deleteProductName', 'deleteName']);
    const deleteModal = getByIds(['modalDelete', 'modal-del']);
    const deleteOverlay = getByIds(['modalOverlayDelete', 'modalOverlay']);

    if (deleteName) deleteName.textContent = name;
    if (deleteModal) deleteModal.classList.add('active');
    if (deleteOverlay) deleteOverlay.classList.add('active');
}

function closeModalDelete() {
    const deleteModal = getByIds(['modalDelete', 'modal-del']);
    const deleteOverlay = getByIds(['modalOverlayDelete', 'modalOverlay']);
    if (deleteModal) deleteModal.classList.remove('active');
    if (deleteOverlay) deleteOverlay.classList.remove('active');
}

function deleteProduct() {
    products = products.filter(p => p.id !== delId);

    let totalPages = getTotalPages(products);
    if (currentPage > totalPages) currentPage = totalPages;

    localStorage.setItem('myProduct', JSON.stringify(products));
    render();
    closeModalDelete();
}

// sửa
function openModalEdit(id) {
    let product = products.find(p => p.id === id);
    if (!product) return;

    clearEditErrors();
    document.getElementById('editOriginalID').value  = product.id;
    document.getElementById('editID').value          = product.id;
    document.getElementById('editName').value        = product.product_name;
    let editPriceEl = document.getElementById('editPrice');
    let editQuantityEl = document.getElementById('editQuantity');
    let editDiscountEl = document.getElementById('editDiscount');
    let editImageEl = document.getElementById('editImage');
    let editDescEl = document.getElementById('editDesc');
    if (editPriceEl) editPriceEl.value = product.price;
    if (editQuantityEl) editQuantityEl.value = product.quantity;
    if (editDiscountEl) editDiscountEl.value = product.discount;
    if (editImageEl) editImageEl.value = product.image || '';
    if (editDescEl) editDescEl.value = product.description || '';

    let statusRadio = document.querySelector(`input[name="editStatus"][value="${product.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    renderCategoryOptions();
    const editCategoryEl = document.getElementById('editCategory');
    if (editCategoryEl) editCategoryEl.value = product.category;

    const modalEdit = getByIds(['modalEdit']);
    const modalOverlayEdit = getByIds(['modalOverlayEdit', 'modalOverlay']);
    if (modalEdit) modalEdit.classList.add('active');
    if (modalOverlayEdit) modalOverlayEdit.classList.add('active');
}

function closeModalEdit() {
    const modalEdit = getByIds(['modalEdit']);
    const modalOverlayEdit = getByIds(['modalOverlayEdit', 'modalOverlay']);
    if (modalEdit) modalEdit.classList.remove('active');
    if (modalOverlayEdit) modalOverlayEdit.classList.remove('active');
}

function editProduct() {
    clearEditErrors();
    let check = true;

    let originalId = document.getElementById('editOriginalID').value;
    let newId      = document.getElementById('editID').value.trim();
    let name       = document.getElementById('editName').value.trim();
    let editCategoryEl = document.getElementById('editCategory');
    let editPriceEl = document.getElementById('editPrice');
    let editQuantityEl = document.getElementById('editQuantity');
    let editDiscountEl = document.getElementById('editDiscount');
    let checkedStatus = document.querySelector('input[name="editStatus"]:checked');
    let index = products.findIndex(p => p.id === originalId);
    if (index === -1) return;
    let old = products[index];

    let category   = editCategoryEl ? editCategoryEl.value : old.category;
    let price      = editPriceEl ? editPriceEl.value.trim() : String(old.price);
    let qty        = editQuantityEl ? editQuantityEl.value.trim() : String(old.quantity);
    let discount   = editDiscountEl ? editDiscountEl.value.trim() : String(old.discount);
    let status     = checkedStatus ? checkedStatus.value : old.status;

    if (newId === '') {
        showError(document.getElementById('editID'), 'editIdErr', 'Mã sản phẩm không được để trống');
        check = false;
    } else {
        let isDuplicate = products.some(p => p.id === newId && p.id !== originalId);
        if (isDuplicate) {
            showError(document.getElementById('editID'), 'editIdErr', 'Mã sản phẩm đã tồn tại');
            check = false;
        }
    }

    if (name === '') {
        showError(document.getElementById('editName'), 'editNameErr', 'Tên sản phẩm không được để trống');
        check = false;
    }

    if (editCategoryEl && category === '') {
        showError(document.getElementById('editCategory'), 'editCategoryErr', 'Vui lòng chọn danh mục');
        check = false;
    }

    if (editPriceEl && (price === '' || isNaN(price) || Number(price) < 0)) {
        showError(document.getElementById('editPrice'), 'editPriceErr', 'Giá không hợp lệ');
        check = false;
    }

    if (editQuantityEl && (qty === '' || isNaN(qty) || Number(qty) < 0)) {
        showError(document.getElementById('editQuantity'), 'editQuantityErr', 'Số lượng không hợp lệ');
        check = false;
    }

    if (editDiscountEl && (discount === '' || isNaN(discount) || Number(discount) < 0 || Number(discount) > 100)) {
        showError(document.getElementById('editDiscount'), 'editDiscountErr', 'Giảm giá phải từ 0 đến 100');
        check = false;
    }

    if (!check) return;

    products[index] = {
        id: newId,
        product_name: name,
        category: category,
        price: +r(price),
        quantity: +(qty),
        discount: +(discount),
        image: document.getElementById('editImage') ? document.getElementById('editImage').value.trim() : old.image,
        description: document.getElementById('editDesc') ? document.getElementById('editDesc').value.trim() : old.description,
        status: status
    };

    localStorage.setItem('myProduct', JSON.stringify(products));
    render();
    closeModalEdit();
}

function showError(input, errId, message) {
    input.classList.add('invalid');
    let errEl = document.getElementById(errId);
    if (errEl) {
        if (message) errEl.textContent = message;
        errEl.classList.add('show');
    }
}

function clearAddErrors() {
    ['inputId','inputName','inputCategory','inputPrice','inputQuantity','inputDiscount','inputImage'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
    });
    ['idErr','nameErr','categoryErr','priceErr','quantityErr','discountErr'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('show');
    });
}

function clearEditErrors() {
    ['editID','editName','editCategory','editPrice','editQuantity','editDiscount'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
    });
    ['editIdErr','editNameErr','editCategoryErr','editPriceErr','editQuantityErr','editDiscountErr'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('show');
    });
}


render();


window.editCategory = editProduct;
window.delCategory = deleteProduct;
window.openModelDelete = openModalDelete;