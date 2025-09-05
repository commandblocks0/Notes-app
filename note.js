const categories = JSON.parse(localStorage.getItem('notes')) || {};

const noteName = document.querySelector('.note-name');
const noteContent = document.querySelector('.note-content');
const sessionCategory = sessionStorage.getItem('category');
const sessionNote = sessionStorage.getItem('note');

noteName.value = categories[sessionCategory][sessionNote].name || 'Untitled';
noteContent.value = categories[sessionCategory][sessionNote].content || '';

noteName.addEventListener('change', () => {
    try {
        categories[sessionCategory][sessionNote].name = noteName.value.trim() || 'Untitled';
        localStorage.setItem('notes', JSON.stringify(categories));
    } catch {
        alert('Error')
        window.location.href = 'index.html';
    }
});

noteContent.addEventListener('input', () => {
    try {
        categories[sessionCategory][sessionNote].content = noteContent.value;
        localStorage.setItem('notes', JSON.stringify(categories));
    } catch {
        alert('Error')
        window.location.href = 'index.html';
    }
});

let dragStartX, dragStartY
document.addEventListener('touchstart', (e) => {
    dragStartY = e.touches[0].clientY
    dragStartX = e.touches[0].clientX
})

document.addEventListener('touchend', (e) => {
    if (e.changedTouches[0].clientY - dragStartY > 50) {
        window.location.href = 'index.html';
    }
})