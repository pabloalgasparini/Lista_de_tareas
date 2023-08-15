import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  // Estado para almacenar la lista de tareas
  const [tasks, setTasks] = useState([]);
  // Estados para el nuevo título, estado y completado de la tarea que se va a agregar
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEstado, setNewTaskEstado] = useState('Sin hacer');
  const [newTaskCompleted, setNewTaskCompleted] = useState(false);

  useEffect(() => {
    // Cargar las tareas al cargar la página
    fetchTasks();
  }, []);

  // Función para obtener la lista de tareas desde el servidor
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tarea');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  // Función para agregar una nueva tarea
  const addTask = async () => {
    // Verificar que el título tenga al menos 2 caracteres
    if (newTaskTitle.trim().length >= 2) {
      try {
        const response = await axios.post('http://localhost:5000/tarea', {
          titulo: newTaskTitle,
          estado: newTaskEstado,
          completado: newTaskCompleted,
        });
        // Si la respuesta es exitosa, actualizar la lista de tareas y limpiar campos
        if (response.status === 201) {
          fetchTasks();
          setNewTaskTitle('');
          setNewTaskEstado('');
          setNewTaskCompleted(false);
        }
      } catch (error) {
        console.error('Error al crear tarea:', error);
      }
    } else {
      console.error('El título debe tener al menos 2 caracteres');
    }
  };

  // Función para actualizar el estado de una tarea
  const updateTaskEstado = async (taskId, newEstado) => {
    try {
      // Enviar una solicitud PUT para actualizar el estado de la tarea
      await axios.put(`http://localhost:5000/tarea/${taskId}`, {
        estado: newEstado,
      });
      // Actualizar la lista de tareas
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar estado de tarea:', error);
    }
  };

  // Función para eliminar una tarea
  const deleteTask = async (taskId) => {
    try {
      // Enviar una solicitud DELETE para eliminar la tarea
      await axios.delete(`http://localhost:5000/tarea/${taskId}`);
      // Actualizar la lista de tareas
      fetchTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Tareas</h1>
      <div className="task-input">
        {/* Campo de entrada para el nuevo título de tarea */}
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nuevo Título"
        />
        {/* Menú desplegable para seleccionar el estado de la tarea */}
        <select
          value={newTaskEstado}
          onChange={(e) => setNewTaskEstado(e.target.value)}
        >
          <option value="Sin hacer">Sin hacer</option>
          <option value="En proceso">En proceso</option>
          <option value="Completo">Completo</option>
        </select>
        {/* Botón para agregar una nueva tarea */}
        <button onClick={addTask}>Agregar Tarea</button>
      </div>
      {/* Lista de tareas */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {/* Mostrar el título de la tarea */}
            <span className={`task-title ${task.estado}`}>{task.titulo}</span>
            {/* Mostrar checkboxes de estado */}
            <label>
              <input
                type="checkbox"
                checked={task.estado === 'Completo'}
                onChange={() => updateTaskEstado(task._id, 'Completo')}
              />
              Completado
            </label>
            <label>
              <input
                type="checkbox"
                checked={task.estado === 'En proceso'}
                onChange={() => updateTaskEstado(task._id, 'En proceso')}
              />
              En Proceso
            </label>
            <label>
              <input
                type="checkbox"
                checked={task.estado === 'Sin hacer'}
                onChange={() => updateTaskEstado(task._id, 'Sin hacer')}
              />
              Sin Hacer
            </label>
            {/* Botón para eliminar la tarea */}
            <button onClick={() => deleteTask(task._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
