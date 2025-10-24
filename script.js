const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const checklist = document.getElementById('checklist');
const prioritySelect = document.getElementById('priority');
const categorySelect = document.getElementById('category');
const filterCategory = document.getElementById('filterCategory');
const filterPriority = document.getElementById('filterPriority');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Guardar tareas
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderizar tareas con filtros
function renderTasks() {
    checklist.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        return (filterCategory.value === 'Todas' || task.category === filterCategory.value) &&
               (filterPriority.value === 'Todas' || task.priority === filterPriority.value);
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.text} (${task.category})`;
        li.classList.add(task.priority, task.category);
        if(task.completed) li.classList.add('completed');

        // Botón eliminar
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.addEventListener('click', () => {
            const realIndex = tasks.indexOf(task);
            tasks.splice(realIndex, 1);
            saveTasks();
            renderTasks();
        });

        // Marcar completado
        li.addEventListener('click', (e) => {
            if(e.target !== delBtn){
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        });

        li.appendChild(delBtn);
        li.setAttribute('draggable', true);

        // Arrastrar y soltar
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tasks.indexOf(task));
        });
        li.addEventListener('dragover', (e) => e.preventDefault());
        li.addEventListener('drop', (e) => {
            const draggedIndex = e.dataTransfer.getData('text');
            const targetIndex = tasks.indexOf(task);
            [tasks[draggedIndex], tasks[targetIndex]] = [tasks[targetIndex], tasks[draggedIndex]];
            saveTasks();
            renderTasks();
        });

        checklist.appendChild(li);
    });

    // Notificación simple de tareas pendientes
    const pending = tasks.filter(t => !t.completed).length;
    if(pending > 0){
        document.title = `Checklist Pro (${pending} pendientes)`;
    } else {
        document.title = 'Checklist Pro ✅';
    }
}

// Agregar tarea
addBtn.addEventListener('click', () => {
    const text = itemInput.value.trim();
    const priority = prioritySelect.value;
    const category = categorySelect.value;
    if(text){
        tasks.push({text, priority, category, completed:false});
        saveTasks();
        renderTasks();
        itemInput.value = '';
    }
});

// Agregar con Enter
itemInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') addBtn.click();
});

// Filtros
filterCategory.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);

// Inicializar
renderTasks();
