import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface Income {
  id: number;
  date: string;
  concept: string;
  amount: number;
}

interface Expense {
  id: number;
  date: string;
  concept: string;
  amount: number;
  category: string;
}

interface CalculatorValues {
  monthlySaving: number;
  savingMonths: number;
  savingGoal: number;
  monthlyAmount: number;
  emergencyExpenses: number;
  emergencyMonths: number;
}

interface ProjectionData {
  mes: number;
  ingresos: number;
  gastos: number;
  ahorroMes: number;
  fondoEmergencia: number;
  ahorroAcumulado: number;
  totalAcumulado: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notes, setNotes] = useState<string>('');

  const [calculatorValues, setCalculatorValues] = useState<CalculatorValues>({
    monthlySaving: 250,
    savingMonths: 12,
    savingGoal: 5000,
    monthlyAmount: 250,
    emergencyExpenses: 530.25,
    emergencyMonths: 3
  });

  // ---------- FUNCIONES PARA BACKEND ----------
  const fetchData = async () => {
    try {
      const incomesRes = await axios.get<Income[]>('http://localhost:3001/api/incomes');
      const expensesRes = await axios.get<Expense[]>('http://localhost:3001/api/expenses');
      const notesRes = await axios.get<{ content: string }>('http://localhost:3001/api/notes');

      setIncomes(incomesRes.data || []);
      setExpenses(expensesRes.data || []);
      setNotes(notesRes.data?.content || '');
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addIncome = async () => {
    const newIncome = {
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0
    };
    await axios.post('http://localhost:3001/api/incomes', newIncome);
    fetchData();
  };

  const removeIncome = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/incomes/${id}`);
    fetchData();
  };

  const updateIncome = async (id: number, field: keyof Income, value: string | number) => {
    const updated = incomes.find(i => i.id === id);
    if (!updated) return;

    (updated as any)[field] = field === 'amount' ? Number(value) || 0 : value;

    await axios.put(`http://localhost:3001/api/incomes/${id}`, updated);
    fetchData();
  };

  const addExpense = async () => {
    const newExpense = {
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0,
      category: 'Personal'
    };
    await axios.post('http://localhost:3001/api/expenses', newExpense);
    fetchData();
  };

  const removeExpense = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/expenses/${id}`);
    fetchData();
  };

  const updateExpense = async (id: number, field: keyof Expense, value: string | number) => {
    const updated = expenses.find(e => e.id === id);
    if (!updated) return;

    (updated as any)[field] = field === 'amount' ? Number(value) || 0 : value;

    await axios.put(`http://localhost:3001/api/expenses/${id}`, updated);
    fetchData();
  };

  const saveNotes = async () => {
    await axios.put('http://localhost:3001/api/notes', { content: notes });
    alert('¡Notas guardadas exitosamente!');
  };

  // ---------- CÁLCULOS ----------
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyBalance = totalIncome - totalExpenses;

  // ---------- TAB BUTTON COMPONENT ----------
  const TabButton: React.FC<{ tabId: string; children: React.ReactNode; isActive: boolean; onClick: () => void }> =
    ({ children, isActive, onClick }) => (
      <button
        className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );

  const MetricCard: React.FC<{ value: string; label: string; color?: string }> = ({ value, label, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div
        className={`text-3xl font-bold mb-2 ${
          color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-gray-600 uppercase font-semibold">{label}</div>
    </div>
  );

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-light mb-4">🎯 Tu Situación Financiera Actual</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard value={`$${totalIncome.toFixed(2)}`} label="Ingreso Mensual Neto" color="green" />
                <MetricCard value={`$${totalExpenses.toFixed(2)}`} label="Gastos Totales" color="red" />
                <MetricCard value={`$${monthlyBalance.toFixed(2)}`} label="Disponible Mensual" color="green" />
                <MetricCard 
                  value={`${(((totalIncome - totalExpenses) / totalIncome) * 100 || 0).toFixed(2)}%`} 
                  label="Tasa de Ahorro Potencial" 
                  color="yellow" 
                />
              </div>
            </div>
          </div>
        );

      case 'seguimiento':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">📅 Seguimiento y Control Mensual</h3>
            {/* Tabla de Ingresos */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Concepto</th>
                    <th className="p-3 text-left">Monto</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.id} className="border-b hover:bg-green-50">
                      <td className="p-3">
                        <input
                          type="date"
                          value={income.date}
                          onChange={(e) => updateIncome(income.id, 'date', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={income.concept}
                          onChange={(e) => updateIncome(income.id, 'concept', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={income.amount}
                          onChange={(e) => updateIncome(income.id, 'amount', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          step="0.01"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeIncome(income.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          type="button"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addIncome} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-8" type="button">
              ➕ Agregar Ingreso
            </button>

            {/* Tabla de Gastos */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Concepto</th>
                    <th className="p-3 text-left">Monto</th>
                    <th className="p-3 text-left">Categoría</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-red-50">
                      <td className="p-3">
                        <input
                          type="date"
                          value={expense.date}
                          onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={expense.concept}
                          onChange={(e) => updateExpense(expense.id, 'concept', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={expense.amount}
                          onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          step="0.01"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={expense.category}
                          onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        >
                          <option value="Transporte">Transporte</option>
                          <option value="Servicios">Servicios</option>
                          <option value="Personal">Personal</option>
                          <option value="Ahorro">Ahorro</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          type="button"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addExpense} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-8" type="button">
              ➕ Agregar Gasto
            </button>
          </div>
        );

      case 'notas':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">📝 Notas Personales</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={saveNotes}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
              type="button"
            >
              💾 Guardar Notas
            </button>
          </div>
        );

      default:
        return <div>Pestaña no encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex rounded-lg overflow-hidden mb-6 shadow-md">
          <TabButton tabId="resumen" isActive={activeTab === 'resumen'} onClick={() => setActiveTab('resumen')}>
            Resumen
          </TabButton>
          <TabButton tabId="seguimiento" isActive={activeTab === 'seguimiento'} onClick={() => setActiveTab('seguimiento')}>
            Seguimiento
          </TabButton>
          <TabButton tabId="notas" isActive={activeTab === 'notas'} onClick={() => setActiveTab('notas')}>
            Notas
          </TabButton>
        </div>

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default App;