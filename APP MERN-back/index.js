import express from 'express';
import cors from 'cors';
import Tarea from './modeloTarea.js';
import { config } from 'dotenv';
import { connectDB } from './conexion.js';
config();
const app = express();

app.use(express.json());
app.use(cors());

const port = 5000;

app.get('/tarea', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    return res.status(200).json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/tarea', async (req, res) => {
  try {
    const {
      titulo,
      estado
    } = req.body;

    if (!titulo || !estado) {
      return res.status(400).json({
        message: 'La información proporcionada es incorrecta'
      });
    }

    const nuevaTarea = new Tarea({
      titulo,
      estado
    });

    await nuevaTarea.save();
    return res.status(201).json({
      message: 'Tarea creada exitosamente',
      tarea: nuevaTarea
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

app.put('/tarea/:idTarea', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({
        message: 'La información proporcionada es incorrecta'
      });
    }

    const idTarea = req.params.idTarea;
    const updatedTarea = await Tarea.findByIdAndUpdate(idTarea, { estado }, { new: true });

    if (!updatedTarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    return res.status(200).json({ message: 'La tarea fue modificada con éxito', tarea: updatedTarea });
  } catch (error) {
    console.error('Error al modificar tarea:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.delete('/tarea/:idTarea', async (req, res) => {
  try {
    const idTarea = req.params.idTarea;
    const tarea = await Tarea.findById(idTarea);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await tarea.deleteOne();

    return res.status(200).json({ message: 'La tarea fue borrada con éxito' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

connectDB();

app.listen(port);
console.log('Servidor conrriendo en el puerto: ', port);
