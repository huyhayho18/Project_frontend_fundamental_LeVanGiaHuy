let products = JSON.parse(localStorage.getItem("myProduct")) || [];

let sortField = 'product_name';
let sortOrder = 'up';
const quantity = 8;
let currentPage = 1;
let delId = '';

const renderList = document.getElementById('renderList');
const inputSearch = document.getElementById('inputSearch');
const selectCategory = document.getElementById('selectCategory');
const selectStatus = document.getElementById('selectStatus');


function formatPrice(price) {
    return Number(price).toLocaleString('vi-VN') + ' đ';
}

function formatProductStatus(status) {
    return status === "active" 
        ? '<span class="badge badge-active">● Đang hoạt động</span>' 
        : '<span class="badge badge-inactive">● Ngừng hoạt động</span>';
}

// sắp xxeeps
function toggleSort(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'up' ? 'desc' : 'up';
    } else {
        sortField = field;
        sortOrder = 'up';
    }
    currentPage = 1;
    render();
}

// phân trang
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

// hiển thị
function render() {
    renderList.innerHTML = '';

    let key = inputSearch.value.trim().toLowerCase();
    let catVal = selectCategory.value;
    let statVal = selectStatus.value;

    let filtered = products.filter(p => {
        let matchName = p.product_name.toLowerCase().includes(key);
        let matchCat = catVal === "all" || p.category === catVal;
        let matchStatus = statVal === "all" || p.status === statVal;
        return matchName && matchCat && matchStatus;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (!isNaN(valA) && !isNaN(valB)) {
            return sortOrder === 'up' ? valA - valB : valB - valA;
        }
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
            <td>${formatProductStatus(p.status)}</td>
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
}

// tìm kiếm lọc
if (inputSearch) inputSearch.addEventListener('input', () => { currentPage = 1; render(); });
if (selectCategory) selectCategory.addEventListener('change', () => { currentPage = 1; render(); });
if (selectStatus) selectStatus.addEventListener('change', () => { currentPage = 1; render(); });

// thêm
function openModal() {
    document.getElementById('inputId').value = '';
    document.getElementById('inputName').value = '';
    document.getElementById('inputQuantity').value = 1;
    document.getElementById('inputPrice').value = '';
    document.getElementById('inputDiscount').value = 0;
    document.getElementById('inputImage').value = '';
    document.getElementById('inputDesc').value = '';
    
    document.querySelector('input[name="status"][value="active"]').checked = true;

    clearAddErrors();
    renderCategoryOptions();
    document.getElementById('inputCategory').value = '';

    document.getElementById('modal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

function validateCreate() {
    clearAddErrors();
    let check = true;

    let id = document.getElementById('inputId').value.trim();
    let name = document.getElementById('inputName').value.trim();
    let category = document.getElementById('inputCategory').value;
    let price = document.getElementById('inputPrice').value.trim();
    let quantity = document.getElementById('inputQuantity').value.trim();
    let discount = document.getElementById('inputDiscount').value.trim();

    if (id === '') {
        showError(document.getElementById('inputId'), 'idErr', 'Mã sản phẩm không được để trống');
        check = false;
    } else if (products.some(p => p.id === id)) {
        showError(document.getElementById('inputId'), 'idErr', 'Mã sản phẩm đã tồn tại');
        check = false;
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

function createProduct() {
    let status = document.querySelector('input[name="status"]:checked').value;

    let newProduct = {
        id: document.getElementById('inputId').value.trim(),
        product_name: document.getElementById('inputName').value.trim(),
        category: document.getElementById('inputCategory').value,
        price: Number(document.getElementById('inputPrice').value) || 0,
        quantity: Number(document.getElementById('inputQuantity').value) || 0,
        discount: Number(document.getElementById('inputDiscount').value) || 0,
        image: document.getElementById('inputImage').value.trim(),
        description: document.getElementById('inputDesc').value.trim(),
        status: status
    };

    products.push(newProduct);
    localStorage.setItem('myProduct', JSON.stringify(products));

    currentPage = getTotalPages(products);
    render();
}

// xóa
function openModalDelete(id, name) {
    delId = id;
    const deleteNameEl = document.getElementById('deleteName');
    if (deleteNameEl) {
        deleteNameEl.textContent = `Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`;
    }
    document.getElementById('modal-del').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModalDelete() {
    document.getElementById('modal-del').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

function deleteProduct() {
    products = products.filter(p => p.id !== delId);

    let totalPages = getTotalPages(products);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    localStorage.setItem('myProduct', JSON.stringify(products));
    render();
    closeModalDelete();
}

// sửa
function openModalEdit(id) {
    let product = products.find(p => p.id === id);
    if (!product) return;

    clearEditErrors();

    document.getElementById('editOriginalID').value = product.id;
    document.getElementById('editID').value = product.id;
    document.getElementById('editName').value = product.product_name;
    document.getElementById('editPrice').value = product.price || '';
    document.getElementById('editQuantity').value = product.quantity || '';
    document.getElementById('editDiscount').value = product.discount || '';
    document.getElementById('editImage').value = product.image || '';
    document.getElementById('editDesc').value = product.description || '';

    let statusRadio = document.querySelector(`input[name="editStatus"][value="${product.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    renderCategoryOptions();
    const editCatSelect = document.getElementById('editCategory');
    if (editCatSelect) editCatSelect.value = product.category;

    document.getElementById('modalEdit').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModalEdit() {
    document.getElementById('modalEdit').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

function editProduct() {
    clearEditErrors();
    let check = true;

    let originalId = document.getElementById('editOriginalID').value;
    let newId      = document.getElementById('editID').value.trim();
    let name       = document.getElementById('editName').value.trim();
    let category   = document.getElementById('editCategory').value;
    let price      = document.getElementById('editPrice').value.trim();
    let qty        = document.getElementById('editQuantity').value.trim();
    let discount   = document.getElementById('editDiscount').value.trim();
    let status     = document.querySelector('input[name="editStatus"]:checked').value;

    if (newId === '') {
        showError(document.getElementById('editID'), 'editIdErr', 'Mã sản phẩm không được để trống');
        check = false;
    } else if (products.some(p => p.id === newId && p.id !== originalId)) {
        showError(document.getElementById('editID'), 'editIdErr', 'Mã sản phẩm đã tồn tại');
        check = false;
    }

    if (name === '') {
        showError(document.getElementById('editName'), 'editNameErr', 'Tên sản phẩm không được để trống');
        check = false;
    }

    if (category === '') {
        showError(document.getElementById('editCategory'), 'editCategoryErr', 'Vui lòng chọn danh mục');
        check = false;
    }

    if (price === '' || isNaN(price) || Number(price) < 0) {
        showError(document.getElementById('editPrice'), 'editPriceErr', 'Giá không hợp lệ');
        check = false;
    }

    if (qty === '' || isNaN(qty) || Number(qty) < 0) {
        showError(document.getElementById('editQuantity'), 'editQuantityErr', 'Số lượng không hợp lệ');
        check = false;
    }

    if (discount === '' || isNaN(discount) || Number(discount) < 0 || Number(discount) > 100) {
        showError(document.getElementById('editDiscount'), 'editDiscountErr', 'Giảm giá phải từ 0 đến 100');
        check = false;
    }

    if (!check) return;

    let index = products.findIndex(p => p.id === originalId);
    if (index !== -1) {
        products[index] = {
            id: newId,
            product_name: name,
            category: category,
            price: Number(price) || 0,
            quantity: Number(qty) || 0,
            discount: Number(discount) || 0,
            image: document.getElementById('editImage').value.trim(),
            description: document.getElementById('editDesc').value.trim(),
            status: status
        };
    }

    localStorage.setItem('myProduct', JSON.stringify(products));
    render();
    closeModalEdit();
}


function renderCategoryOptions() {
    let categories = JSON.parse(localStorage.getItem('myCategory')) || [];
    let activeCategories = categories.filter(c => c.status === 'active');

    // Select lọc trên bảng
    let currentCat = selectCategory.value;
    selectCategory.innerHTML = '<option value="all">Tất cả danh mục</option>';
    activeCategories.forEach(c => {
        let opt = new Option(c.category_name, c.category_name);
        if (c.category_name === currentCat) opt.selected = true;
        selectCategory.appendChild(opt);
    });

    //  modal thêm
    let addSelect = document.getElementById('inputCategory');
    if (addSelect) {
        let prev = addSelect.value;
        addSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        activeCategories.forEach(c => {
            let opt = new Option(c.category_name, c.category_name);
            if (c.category_name === prev) opt.selected = true;
            addSelect.appendChild(opt);
        });
    }

    //  modal sửa
    let editSelect = document.getElementById('editCategory');
    if (editSelect) {
        let prev = editSelect.value;
        editSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        activeCategories.forEach(c => {
            let opt = new Option(c.category_name, c.category_name);
            if (c.category_name === prev) opt.selected = true;
            editSelect.appendChild(opt);
        });
    }
}

function showError(input, errId, message = '') {
    input.classList.add('invalid');
    let errEl = document.getElementById(errId);
    if (errEl) {
        if (message) errEl.textContent = message;
        errEl.classList.add('show');
    }
}

function clearAddErrors() {
    const inputs = ['inputId','inputName','inputCategory','inputPrice','inputQuantity','inputDiscount'];
    const errors = ['idErr','nameErr','categoryErr','priceErr','quantityErr','discountErr'];

    inputs.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
    });
    errors.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('show');
    });
}

function clearEditErrors() {
    const inputs = ['editID','editName','editCategory','editPrice','editQuantity','editDiscount'];
    const errors = ['editIdErr','editNameErr','editCategoryErr','editPriceErr','editQuantityErr','editDiscountErr'];

    inputs.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
    });
    errors.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove('show');
    });
}


render();

