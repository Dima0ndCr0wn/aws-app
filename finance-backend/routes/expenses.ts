import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// Obtener todos los gastos
router.get('/', async (req, res) => {
  try {
    const database = await db;
    const expenses = await database.all('SELECT * FROM expenses');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Crear un nuevo gasto
router.post('/', async (req, res) => {
  try {
    const { date, concept, amount } = req.body;
    const database = await db;
    const result = await database.run(
      'INSERT INTO expenses (date, concept, amount) VALUES (?, ?, ?)',
      [date, concept, amount]
    );
    res.json({ id: result.lastID, date, concept, amount });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Actualizar un gasto existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, concept, amount } = req.body;
    const database = await db;
    const result = await database.run(
      'UPDATE expenses SET date = ?, concept = ?, amount = ? WHERE id = ?',
      [date, concept, amount, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.json({ id, date, concept, amount });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Eliminar un gasto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = await db;
    const result = await database.run('DELETE FROM expenses WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.json({ message: 'Gasto eliminado' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
