const categories = JSON.parse(localStorage.getItem('notes')) || {};

const noteName = document.querySelector('.main .note-name');
const noteContent = document.querySelector('.main .note-content');
const secondaryName = document.querySelector('.secondary .note-name');
const secondaryContent = document.querySelector('.secondary .note-content');
const secondaryWindow = document.querySelector('.secondary');
const mainWindow = document.querySelector('.main');

let sessionNote = sessionStorage.getItem('note');
let sessionCategory = sessionStorage.getItem('category');

noteName.value = categories[sessionCategory][sessionNote].name || 'Untitled';
noteContent.value = categories[sessionCategory][sessionNote].content || '';

function moveNote(direction) {
    if (direction === 'left') {
        if (sessionNote > 0) {
            secondaryWindow.style.translate = '-100vw 0'
            secondaryWindow.style.display = 'flex';

            mainWindow.style.animation = 'none'
            mainWindow.offsetWidth
            mainWindow.style.animation = 'fade 1s'

            sessionNote--
            sessionStorage.setItem('note', sessionNote)

            secondaryName.value = categories[sessionCategory][sessionNote].name;
            secondaryContent.value = categories[sessionCategory][sessionNote].content;

            setTimeout(() => {
                secondaryWindow.style.display = 'none';
                noteName.value = secondaryName.value;
                noteContent.value = secondaryContent.value;
            }, 1000);
        }
    } else if (direction === 'right') {
        if (sessionNote < categories[sessionCategory].length-1) {
            secondaryWindow.style.translate = '100vw 0'
            secondaryWindow.style.display = 'flex';

            mainWindow.style.animation = 'none'
            mainWindow.offsetWidth
            mainWindow.style.animation = 'fade 1s'

            sessionNote++
            sessionStorage.setItem('note', sessionNote)

            secondaryName.value = categories[sessionCategory][sessionNote].name;
            secondaryContent.value = categories[sessionCategory][sessionNote].content;

            setTimeout(() => {
                secondaryWindow.style.display = 'none';
                noteName.value = secondaryName.value;
                noteContent.value = secondaryContent.value;
            }, 1000);
        }
    }
}

noteName.addEventListener('input', () => {
    categories[sessionCategory][sessionNote].name = noteName.value.trim() || 'Untitled';
    localStorage.setItem('notes', JSON.stringify(categories));
});

noteName.addEventListener('change', ()=>{
    if (noteName.value.trim() === '') {
        noteName.value = 'Untitled';
    }
})

noteName.addEventListener('focus', () => {
    noteName.select();
});

noteContent.addEventListener('input', () => {
    try {
        categories[sessionCategory][sessionNote].content = noteContent.value;
        localStorage.setItem('notes', JSON.stringify(categories));
    } catch {
        alert('Error')
        window.location.href = '/';
    }
});

let dragStartX, dragStartY
document.addEventListener('touchstart', (e) => {
    dragStartY = e.touches[0].clientY
    dragStartX = e.touches[0].clientX
})

document.addEventListener('touchend', (e) => {
    if (e.changedTouches[0].clientY - dragStartY > 50) {
        mainWindow.style.animation = 'none'
        mainWindow.offsetWidth
        mainWindow.style.animation = 'slideDown 1s'
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } else if (e.changedTouches[0].clientX - dragStartX < -50) {
        moveNote('right')
    } else if (e.changedTouches[0].clientX - dragStartX > 50) {
        moveNote('left')
    }
})