import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Profile State
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Task State
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // 👇 NEW: State for Inline Editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch Profile & Tasks on load
  useEffect(() => {
    const fetchProfileAndTasks = async () => {
      try {
        const profileRes = await fetch('http://localhost:3000/check', { credentials: 'include' });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserData(profileData);
        }

        const tasksRes = await fetch('http://localhost:3000/tasks', { credentials: 'include' });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoadingProfile(false);
        setIsLoadingTasks(false);
      }
    };
    fetchProfileAndTasks();
  }, []);

  // --- TASK CRUD FUNCTIONS ---

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTaskTitle })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setNewTaskTitle('');
        toast.success('Task added!');
      }
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, completed: !currentStatus } : task
        ));
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // 👇 NEW: Function to save the edited title
  const handleSaveEdit = async (taskId) => {
    if (!editingText.trim()) {
      setEditingTaskId(null); // Just cancel if they wiped out the text
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Send the new title to the backend
        body: JSON.stringify({ title: editingText }) 
      });

      if (response.ok) {
        // Update the UI instantly
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, title: editingText } : task
        ));
        setEditingTaskId(null); // Close the edit box
        toast.success('Task updated!');
      }
    } catch (err) {
      toast.error('Failed to save edit');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.info('Task deleted');
      }
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', { method: 'POST', credentials: 'include' });
      if (response.ok) {
        toast.success('Logout successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800">My App</h1>
          <button onClick={handleLogout} className="px-6 py-2 text-white font-semibold bg-red-500 rounded-lg hover:bg-red-600 transition-all">
            Logout
          </button>
        </div>

        <div className="text-center mb-10">
          <div className='text-orange-400 text-5xl font-bold'>Dashboard</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Section (Left) */}
          <div className="md:col-span-1">
            {isLoadingProfile ? (
              <div className="flex justify-center p-8">Loading Profile...</div>
            ) : userData ? (
              <div onClick={() => navigate('/profile')} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-24"></div>
                <div className="px-6 py-8 relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
                    <span className="text-3xl font-bold text-orange-500">
                      {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div className="text-center mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{userData.fullName}</h2>
                    <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full mt-2">
                      @{userData.username}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-500">Could not load profile.</div>
            )}
          </div>

          {/* Task Manager (Right) */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" disabled={!newTaskTitle.trim()} className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors">
                Add
              </button>
            </form>

            {isLoadingTasks ? (
              <div className="text-center text-gray-500 py-4">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
                No tasks yet. Create one above!
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li 
                    key={task._id} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'
                    }`}
                  >
                    {/* 👇 Check if THIS is the task currently being edited */}
                    {editingTaskId === task._id ? (
                      <div className="flex flex-col md:flex-row items-center  gap-2 w-full">
                        <input 
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-3 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          autoFocus // Automatically puts the cursor in the box
                        />
                        <div className='flex items-center gap-2'>
                          <button 
                            onClick={() => handleSaveEdit(task._id)}
                            className="text-white bg-green-500 hover:bg-green-600 text-sm px-3 py-1 rounded transition-colors"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingTaskId(null)}
                            className="text-gray-600 hover:bg-gray-200 text-sm px-3 py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>


                        </div>
                      </div>
                    ) : (
                      // NORMAL TASK VIEW
                      <>
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            onChange={() => handleToggleTask(task._id, task.completed)}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
                          />
                          <span className={`text-lg truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* EDIT BUTTON */}
                          <button 
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditingText(task.title); // Pre-fill the input box with the current title
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          {/* DELETE BUTTON */}
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-400 hover:text-red-600 font-semibold text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;