import { Router } from 'express';
import { db } from '../db.ts';

const router = Router();

// Obtener todos los ingresos
router.get('/', async (req, res) => {
  try {
    const database = await db;
    const incomes = await database.all('SELECT * FROM incomes');
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Crear un nuevo ingreso
router.post('/', async (req, res) => {
  try {
    const { date, concept, amount } = req.body;
    const database = await db;
    const result = await database.run(
      'INSERT INTO incomes (date, concept, amount) VALUES (?, ?, ?)',
      [date, concept, amount]
    );
    res.json({ id: result.lastID, date, concept, amount });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Actualizar un ingreso existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, concept, amount } = req.body;
    const database = await db;
    const result = await database.run(
      'UPDATE incomes SET date = ?, concept = ?, amount = ? WHERE id = ?',
      [date, concept, amount, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }

    res.json({ id, date, concept, amount });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Eliminar un ingreso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = await db;
    const result = await database.run('DELETE FROM incomes WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }

    res.json({ message: 'Ingreso eliminado' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
