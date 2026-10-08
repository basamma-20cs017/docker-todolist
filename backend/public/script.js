const API_URL = window.location.origin;

const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

async function loadTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`);
    const todos = await response.json();

    totalCount.textContent = `${todos.length} task${todos.length !== 1 ? 's' : ''}`;
    const completed = todos.filter(t => t.completed).length;
    completedCount.textContent = `${completed} completed`;

    if (todos.length === 0) {
      todoList.innerHTML = `<div class="empty-state">No tasks yet. Add your first task above!</div>`;
      return;
    }

    todoList.innerHTML = todos.map(todo => `
      <div class="todo-item">
        <div class="todo-left">
          <div class="checkbox ${todo.completed ? 'checked' : ''}" 
               onclick="toggleTodo('${todo._id}', ${!todo.completed})"></div>
          <span class="todo-title ${todo.completed ? 'completed' : ''}">
            ${escapeHtml(todo.title)}
          </span>
        </div>
        <div>
          <button class="btn-icon" onclick="deleteTodo('${todo._id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    todoList.innerHTML = `<div class="empty-state">Failed to load tasks</div>`;
  }
}

async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;
  await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  todoInput.value = '';
  loadTodos();
}

async function toggleTodo(id, completed) {
  await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTodos();
}

async function deleteTodo(id) {
  if (!confirm('Delete this task?')) return;
  await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

loadTodos();
