import express from 'express';
import cors from 'cors';
import incomesRouter from './routes/incomes.ts';
import expensesRouter from './routes/expenses.ts';
import notesRouter from './routes/notes.ts';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/incomes', incomesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/notes', notesRouter);

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
