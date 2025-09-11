const categories = JSON.parse(localStorage.getItem('notes')) || {};

function renderCategories(activeCategory) {
    const container = document.querySelector('.category-container');
    container.innerHTML = '';
    let categoryIndex=0
    for (const category in categories) {
        const div = document.createElement('div');
        div.className = 'category';
        container.appendChild(div);
        div.textContent = category;
        div.draggable = true
        
        div.style.animationDelay = categoryIndex*100+"ms"
        categoryIndex++
        
        const notesWrapper = document.createElement('div')
        notesWrapper.className = 'notes-wrapper'
        div.appendChild(notesWrapper)

        const notesContainer = document.createElement('div');
        notesContainer.className = 'notes-container';
        notesWrapper.appendChild(notesContainer);

        const addNoteButton = document.createElement('button');
        addNoteButton.className = 'add-note-button';
        addNoteButton.textContent = 'Add Note';
        notesContainer.appendChild(addNoteButton);

        addNoteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            categories[category].push({
                name: 'Untitled',
                content: ''
            });
            localStorage.setItem('notes', JSON.stringify(categories));
            renderCategories(category);
        })

        for (const i in categories[category]) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.textContent = categories[category][i].name;
            notesContainer.appendChild(noteDiv);

            noteDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                sessionStorage.setItem('category', category);
                sessionStorage.setItem('note', i);
                window.location.href = 'note.html';
            })

            let noteDragStartX;
            noteDiv.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                noteDragStartX = e.touches[0].clientX
            })

            noteDiv.addEventListener('touchmove', (e) => {
                e.stopPropagation();
                noteDiv.style.opacity = Math.max(0, 1 - Math.abs(noteDragStartX - e.touches[0].clientX) / 200);
            })

            noteDiv.addEventListener('touchend', (e) => {
                e.stopPropagation();
                noteDiv.style.opacity = 1;
                if (Math.abs(noteDragStartX - e.changedTouches[0].clientX) > 200) {
                    const confirmDelete = confirm(`Do you want to delete the note "${categories[category][i].name}"?`);
                    if (confirmDelete) {
                        categories[category].splice(i, 1);
                        localStorage.setItem('notes', JSON.stringify(categories));
                        renderCategories(category);
                    }
                }
            })
        }

        if (category === activeCategory) {
            div.classList.add('open');
            notesWrapper.style.maxHeight = notesWrapper.scrollHeight +"px"
        }

        let clickTimer
        div.addEventListener('click', (e) => {
            document.querySelectorAll('.category').forEach(i => {
                if (i !== div) {
                    i.classList.remove('open')
                    i.querySelector('.notes-wrapper').style.maxHeight = '0'
                }
            });
            
            div.classList.toggle('open');
            
            if (div.classList.contains("open")) {
                notesWrapper.style.maxHeight = notesWrapper.scrollHeight +"px"
            } else {
                notesWrapper.style.maxHeight = "0"
            }
        })

        div.addEventListener('dblclick', (e) => {
            clearTimeout(clickTimer)
            const name = prompt('Enter new category name:', category);
            if (name.trim()) {
                categories[name] = categories[category];
                delete categories[category];
                localStorage.setItem('notes', JSON.stringify(categories));
                renderCategories();
            }
        })

        let catagoryDragStartX;
        div.addEventListener('touchstart', (e) => {
            catagoryDragStartX = e.touches[0].clientX
        })

        div.addEventListener('touchmove', (e) => {
            div.style.opacity = Math.max(0, 1 - Math.abs(catagoryDragStartX - e.touches[0].clientX) / 200);
        })

        div.addEventListener('touchend', (e) => {
            div.style.opacity = 1;
            if (Math.abs(catagoryDragStartX - e.changedTouches[0].clientX) > 200) {
                const confirmDelete = confirm(`Do you want to delete the category "${category}"?`);
                if (confirmDelete) {
                    delete categories[category];
                    localStorage.setItem('notes', JSON.stringify(categories));
                    renderCategories();
                }
            }
        })
    }
}

document.querySelector('.add-category-button').addEventListener('click', () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName.trim() && !categories[categoryName]) {
        categories[categoryName] = [{
            name: 'Untitled',
            content: ''
        }];
        localStorage.setItem('notes', JSON.stringify(categories));
        renderCategories();
    }
})

renderCategories();
