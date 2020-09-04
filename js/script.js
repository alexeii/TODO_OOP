'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));

    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }
    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span> 
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                 <button class="todo-complete"></button> 
            </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('Вы ничего не ввели');
        }
    }
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    //найти по ключу элемент и удалить из new Map и сделать render()
    deleteItem(item) {
        this.todoData.forEach((el) => {
            if (el.key === item.key) {
                this.todoData.delete(el.key);
            }
        });
        this.render();
    }
    //forEach перебрать todoData и поменять значение completed
    completedItem(item) {
        this.todoData.forEach((el) => {
            if (el.key === item.key) {
                if (el.completed === true) {
                    el.completed = false;
                } else {
                    el.completed = true;
                }
            }
        });
        this.render();
    }
    //обработчик событий определяет на какую кнопку кликнули и вызвать deltte || completed
    //на todo-container
    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.todo-remove')) {
                const item = target.closest('.todo-item');
                this.deleteItem(item);
            } else if (target.matches('.todo-complete')) {
                const item = target.closest('.todo-item');
                this.completedItem(item);
            }
        });

    }


    init() {

        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();