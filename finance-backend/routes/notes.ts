import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// Obtener todas las notas
router.get('/', async (req, res) => {
  try {
    const database = await db;
    const notes = await database.all('SELECT * FROM notes');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Crear una nueva nota
router.post('/', async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const database = await db;
    const result = await database.run(
      'INSERT INTO notes (title, content, date) VALUES (?, ?, ?)',
      [title, content, date]
    );
    res.json({ id: result.lastID, title, content, date });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Actualizar una nota existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date } = req.body;
    const database = await db;
    const result = await database.run(
      'UPDATE notes SET title = ?, content = ?, date = ? WHERE id = ?',
      [title, content, date, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }

    res.json({ id, title, content, date });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Eliminar una nota
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = await db;
    const result = await database.run('DELETE FROM notes WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }

    res.json({ message: 'Nota eliminada' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
