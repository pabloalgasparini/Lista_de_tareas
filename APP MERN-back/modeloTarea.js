import { Schema, model } from 'mongoose';

const schemaTarea = new Schema({
  titulo: {
    type: String,
    required: true // Cambio aquí: Debería ser "required"
  },
  estado: {
    type: String,
    required: true // Cambio aquí: Debería ser "required"
  }
});

export default model('Tarea', schemaTarea);
