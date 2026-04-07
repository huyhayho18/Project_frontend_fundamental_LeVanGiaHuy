let categories = JSON.parse(localStorage.getItem("myCategory")) || [];

// let categories = [
//   { id: "DM001", category_name: "Quần áo",       status: "active"    },
//   { id: "DM002", category_name: "Kính mắt",      status: "inactive"  },
//   { id: "DM003", category_name: "Giày dép",      status: "active"    },
//   { id: "DM004", category_name: "Thời trang nam",status: "inactive"  },
//   { id: "DM005", category_name: "Thời trang nữ", status: "inactive"  },
//   { id: "DM006", category_name: "Hoa quả",       status: "inactive"  },
//   { id: "DM007", category_name: "Rau",           status: "active"    },
//   { id: "DM008", category_name: "Điện thoại",    status: "inactive"  },
// ];
//localStorage.setItem("myCategory",JSON.stringify(categories));


let renderList = document.getElementById('renderList');
let inputSearch = document.getElementById('inputSearch');

inputSearch.addEventListener('input', () => {
    currentPage = 1;
    render();
});

document.getElementById('select-filter').addEventListener('change', () => {
    currentPage = 1;
    render();
})

let sortField = 'category_name';
let sortOrder = 'up';

// phân trang
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
    let status = document.getElementById('select-filter').value;
    let fillterName = categories.filter((category) => {
        let searchName = category.category_name.toLowerCase().includes(key);
        let fillterStatus = status === "all" || category.status === status;
        return searchName && fillterStatus;
    });

    fillterName.sort((a, b) => {
        if (sortOrder === 'up') {
            return a[sortField].localeCompare(b[sortField], 'vi');
        }
        return b[sortField].localeCompare(a[sortField], 'vi');
    });

    let pageData = getPageData(fillterName);

    pageData.forEach( categoryList => {
        let showList = document.createElement('tr');
        showList.innerHTML = `
            <td>${categoryList.id}</td>
            <td>${categoryList.category_name}</td>
            <td><span class="badge ${categoryList.status === "active" ? "badge-active" : "badge-inactive"}">${categoryList.status === "active" ? "● Đang hoạt động" : "● Ngừng hoạt động"}</span></td>
            <td class="actions">
                <button class="btn-delete" onclick="openModelDelete('${categoryList.id}','${categoryList.category_name}')"><i class="fa-regular fa-trash-can"></i></button>
                <button class="btn-edit" onclick="openModalEdit('${categoryList.id}', '${categoryList.category_name}', '${categoryList.status}')"><i class="fa-solid fa-pencil"></i></button>
            </td>`
        renderList.appendChild(showList);
    });

    renderPagination(fillterName);

}


let inputName = document.getElementById('inputName');
let inputId = document.getElementById('inputId');

// thêm mới
function create() {
    let status = document.querySelector('input[name="status"]:checked').value;

    let newCategory = {
        id: inputId.value,
        category_name : inputName.value,
        status: status
    }
    categories.push(newCategory)
    inputId.value='';
    inputName.value='';

    currentPage = getTotalPages(categories);

    localStorage.setItem("myCategory", JSON.stringify(categories));
    render();
}

// xóa
function delCategory() {
    categories = categories.filter(category => category.id !== delId)

    let totalPages = getTotalPages(categories);
    if (currentPage > totalPages) currentPage = totalPages;

    localStorage.setItem("myCategory", JSON.stringify(categories));
    render();
    closeModalDelete();
}

//sửa
function editCategory() {

    let originalId = document.getElementById("editOriginalID").value; // id gốc
    let newId = document.getElementById("editID").value.trim();
    let name = document.getElementById("editName").value.trim();
    let status = document.querySelector('input[name="editStatus"]:checked').value;

    let check = true;
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll(".form-input").forEach(err => err.classList.remove("invalid"));
    if(newId === '') {
        showError(document.getElementById("editID"),'idEditErr')
        check = false;
    } else {
        let isDuplicate = categories.some(
            category => category.id === newId && category.id !== originalId
        );
        if(isDuplicate) {
            showError(document.getElementById("editID"),'idEditErr','Mã danh mục bị trùng');
            check = false;
        }
    }

    
    if(name === '') {
        showError(document.getElementById("editName"),'nameEditErr')
        check = false;
    }

    if (!check) {
        return;
    }

    let index = categories.findIndex(category => category.id === originalId);
    categories[index].id = newId;
    categories[index].category_name = name;
    categories[index].status = status;

    localStorage.setItem("myCategory", JSON.stringify(categories));
    render();
    closeModalEdit();
}

inputId.addEventListener('input', unShow);
inputName.addEventListener('input', unShow);

function validateCreate() {
    let check = true;
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll(".form-input").forEach(err => err.classList.remove("invalid"));
    if (inputId.value.trim() === "") {
        showError(inputId, 'idErr');
        check = false;
    }
    if (inputName.value.trim() === "") {
        showError(inputName, 'nameErr');
        check = false;
    }

    let category = JSON.parse(localStorage.getItem("myCategory")) || [];
    let checkCategory = category.find(u => u.id === inputId.value.trim())
    if (checkCategory) {
        showError(inputId, 'idErr', 'Id đã tồn tại vui lòng chọn id khác');
        check = false;
    }

    if (check) {
        create();
        closeModal();
    }
    return check;

}


function unShow() {
    document.querySelectorAll(".error-msg").forEach(err => err.classList.remove("show"));
    document.querySelectorAll(".form-input").forEach(err => err.classList.remove("invalid"));
    if (inputId.value.trim() === "") {
        showError(inputId, 'idErr');
    }
    if (inputName.value.trim() === "") {
        showError(inputName, 'nameErr');
    } else {

        let category = JSON.parse(localStorage.getItem("myCategory")) || [];
        let checkCategory = category.find(u => u.id === inputId.value.trim())
        if (checkCategory) {
            showError(inputId, 'idErr', 'Id đã tồn tại vui lòng chọn id khác');
        }
    }
}


function showError (input , id  , message ) {
    input.classList.add('invalid');
    let idErr = document.getElementById(id);
    if (message) {
        idErr.innerHTML = message;
    }
    idErr.classList.add('show');
}


//sắp xếp
function toggleSort(data) {
    if (sortField === data) {
        sortOrder = sortOrder === 'up' ? 'desc' : 'up';
    } else {
        sortField = data;
        sortOrder = 'up';
    }
    currentPage = 1;
    render();
}


render();