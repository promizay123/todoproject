import React, { useState, useEffect } from 'react';
import './App.css';
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai"; // Added import

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentEditedItem, setCurrentEditItem] = useState({ title: "", description: "" });

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      completedOn: null,
    };
    let updatedTodoArr = [...allTodos, newTodoItem];
    setTodos(updatedTodoArr);
    setNewTitle("");
    setNewDescription("");
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    let updatedTodos = [...allTodos];
    updatedTodos[index].completedOn = completedOn;
    setTodos(updatedTodos);

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(updatedTodos[index]);
    setCompletedTodos(updatedCompletedArr);

    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);

    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodos = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) setTodos(savedTodo);
    if (savedCompletedTodos) setCompletedTodos(savedCompletedTodos);
  }, []);

  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditItem({ title: item.title, description: item.description });
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditItem((prev) => ({ ...prev, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditItem((prev) => ({ ...prev, description: value }));
  };

  const handleUpdateTodo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    setCurrentEdit(null); // Clear the edit mode
    localStorage.setItem('todolist', JSON.stringify(newTodo)); // Save to localStorage
  };

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What is the task title"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What is the task description"
            />
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => (
              currentEdit === index ? (
                <div className='edit-wrapper' key={index}>
                  <input 
                    placeholder='Updated title' 
                    onChange={(e) => handleUpdateTitle(e.target.value)} 
                    value={currentEditedItem.title} 
                  />
                  <textarea 
                    placeholder='Updated description'
                    rows={4}
                    onChange={(e) => handleUpdateDescription(e.target.value)} 
                    value={currentEditedItem.description} 
                  />
                  <button type="button" onClick={handleUpdateTodo} className="primaryBtn">Update</button>
                </div>
              ) : (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.completedOn && <p><small>Completed on: {item.completedOn}</small></p>}
                  </div>
                  <div>
                    <MdDeleteForever 
                      className='icon' 
                      onClick={() => handleDeleteTodo(index)} 
                      title="Delete?"
                    />
                    <FaCheck 
                      className='check-icon' 
                      onClick={() => handleComplete(index)} 
                      title="Complete?"
                    />
                    <AiOutlineEdit 
                      className='check-icon' 
                      onClick={() => handleEdit(index, item)} 
                      title="Edit?"
                    />
                  </div>
                </div>
              )
            ))}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on: {item.completedOn}</small></p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;