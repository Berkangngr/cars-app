/* eslint-disable @typescript-eslint/no-unused-vars */
import {Todo} from '../../types/Todo';
import {useEffect, useState} from 'react';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';


export const TodoApp = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date(),
        };
        setTodos([...todos, newTodo]);
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        ));
    };

    // Local storage'dan verileri yükle
    // ve state'e ata
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }   
    },[]);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    },[todos]);

    return (
        <div style={{ padding: '20px', maxWidth: '100%' }}>
            <h1>Todo App</h1>
            <AddTodo onAdd={addTodo} />
            <TodoList
            todos={todos}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            />
        </div>
    )

}