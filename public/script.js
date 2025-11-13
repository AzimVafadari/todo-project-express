// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

  const todoList = document.getElementById('todoList');
  const newTodoInput = document.getElementById('newTodoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');

  // --- API Functions ---

  // GET: Fetch and display all todos
  async function loadTodos() {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const todos = await res.json();
      
      todoList.innerHTML = ''; // Clear the list
      todos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
      });
    } catch (error) {
      console.error('Error loading todos:', error);
      todoList.innerHTML = '<li>Error loading todos.</li>';
    }
  }

  // POST: Add a new todo
  async function addTodo() {
    const text = newTodoInput.value.trim();
    if (!text) return; // Don't add empty todos

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('Failed to add todo');
      
      // We get the new todo back and add it to the list
      const newTodo = await res.json();
      todoList.appendChild(createTodoElement(newTodo));
      newTodoInput.value = ''; // Clear the input
      newTodoInput.focus();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  // PUT: Toggle a todo's "done" status
  async function toggleTodo(id, li) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to toggle todo');

      const updatedTodo = await res.json();
      // Update the class based on the new "done" status
      li.classList.toggle('done', updatedTodo.done);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  // DELETE: Remove a todo
  async function deleteTodo(id, li) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      
      // If successful (status 204), remove the element from the DOM
      li.remove();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  // --- Helper Function ---

  // Create the DOM element for a single todo
  function createTodoElement(todo) {
    const li = document.createElement('li');
    li.classList.toggle('done', todo.done);

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    textSpan.onclick = () => toggleTodo(todo.id, li);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×'; // A simple 'x' character
    deleteBtn.onclick = () => deleteTodo(todo.id, li);

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    return li;
  }

  // --- Event Listeners ---

  // Add todo on button click
  addTodoBtn.addEventListener('click', addTodo);

  // Add todo on pressing "Enter" in the input
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  // --- Initial Load ---
  loadTodos();

});