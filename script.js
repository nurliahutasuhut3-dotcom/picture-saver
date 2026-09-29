// Picture Saver - JavaScript Functionality

let pictures = JSON.parse(localStorage.getItem('pictures')) || [];
let selectedPictures = new Set();

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const gallery = document.getElementById('gallery');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');

// Event Listeners
selectBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
downloadBtn.addEventListener('click', downloadSelected);
clearBtn.addEventListener('click', clearAllPictures);

// File upload handlers
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                pictures.push({
                    id: Date.now() + Math.random(),
                    data: event.target.result,
                    name: file.name,
                    size: file.size,
                    date: new Date().toLocaleString()
                });
                savePictures();
                renderGallery();
            };
            reader.readAsDataURL(file);
        }
    });
    fileInput.value = '';
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    fileInput.files = e.dataTransfer.files;
    handleFileSelect({ target: { files: files } });
}

// Gallery rendering
function renderGallery() {
    if (pictures.length === 0) {
        gallery.innerHTML = '<p class="empty-msg">No pictures uploaded yet</p>';
        downloadBtn.disabled = true;
        return;
    }

    gallery.innerHTML = pictures.map(picture => `
        <div class="gallery-item">
            <input type="checkbox" class="checkbox" data-id="${picture.id}">
            <img src="${picture.data}" alt="${picture.name}">
            <div class="overlay">
                <button class="download-btn" onclick="downloadPicture(${picture.id})">Download</button>
                <button class="delete-btn" onclick="deletePicture(${picture.id})">Delete</button>
            </div>
        </div>
    `).join('');

    // Add checkbox event listeners
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.checked) {
                selectedPictures.add(id);
            } else {
                selectedPictures.delete(id);
            }
            downloadBtn.disabled = selectedPictures.size === 0;
        });
    });
}

// Picture management
function deletePicture(id) {
    if (confirm('Are you sure you want to delete this picture?')) {
        pictures = pictures.filter(p => p.id !== id);
        selectedPictures.delete(id);
        savePictures();
        renderGallery();
    }
}

function downloadPicture(id) {
    const picture = pictures.find(p => p.id === id);
    if (picture) {
        const link = document.createElement('a');
        link.href = picture.data;
        link.download = picture.name;
        link.click();
    }
}

function downloadSelected() {
    if (selectedPictures.size === 0) {
        alert('Please select pictures to download');
        return;
    }

    selectedPictures.forEach(id => {
        const picture = pictures.find(p => p.id === id);
        if (picture) {
            const link = document.createElement('a');
            link.href = picture.data;
            link.download = picture.name;
            link.click();
        }
    });
}

function clearAllPictures() {
    if (confirm('Are you sure you want to delete ALL pictures? This cannot be undone!')) {
        pictures = [];
        selectedPictures.clear();
        savePictures();
        renderGallery();
    }
}

// Storage management
function savePictures() {
    localStorage.setItem('pictures', JSON.stringify(pictures));
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', renderGallery);