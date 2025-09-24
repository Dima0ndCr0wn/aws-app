import React, { useState, useEffect } from 'react';

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
  const [incomes, setIncomes] = useState<Income[]>([
    { id: 1, date: '2024-09-01', concept: 'Salario Neto', amount: 900 }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2024-09-01', concept: 'Financiamiento Auto', amount: 272, category: 'Transporte' },
    { id: 2, date: '2024-09-01', concept: 'Celular', amount: 26, category: 'Servicios' },
    { id: 3, date: '2024-09-15', concept: 'Internet', amount: 39, category: 'Servicios' },
    { id: 4, date: '2024-09-01', concept: 'Seguro Auto', amount: 42, category: 'Transporte' }
  ]);

  const [notes, setNotes] = useState<string>(`- Revisar gastos cada semana
- Meta: Fondo de emergencia de $1,500 en 6 meses  
- Investigar opciones de inversión después del mes 6
- Buscar formas de generar ingresos adicionales`);

  const [calculatorValues, setCalculatorValues] = useState<CalculatorValues>({
    monthlySaving: 250,
    savingMonths: 12,
    savingGoal: 5000,
    monthlyAmount: 250,
    emergencyExpenses: 530.25,
    emergencyMonths: 3
  });

  // Cálculos principales
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const availableMoney = 900 - 530.25;
  const monthlyBalance = totalIncome - totalExpenses;

  const addIncome = (): void => {
    const newIncome: Income = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0
    };
    setIncomes([...incomes, newIncome]);
  };

  const addExpense = (): void => {
    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0,
      category: 'Personal'
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeIncome = (id: number): void => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const removeExpense = (id: number): void => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateIncome = (id: number, field: keyof Income, value: string | number): void => {
    setIncomes(incomes.map(income => 
      income.id === id ? { ...income, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : income
    ));
  };

  const updateExpense = (id: number, field: keyof Expense, value: string | number): void => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : expense
    ));
  };

  const generateProjectionData = (): ProjectionData[] => {
    const projectionData: ProjectionData[] = [];
    let fondoEmergencia = 0;
    let ahorroAcumulado = 0;

    for (let mes = 1; mes <= 12; mes++) {
      const ingresos = 900;
      const gastos = 530.25;
      let ahorroMes: number, fondoMes: number;

      if (mes <= 6) {
        fondoMes = 250;
        ahorroMes = 50;
        fondoEmergencia = Math.min(fondoEmergencia + fondoMes, 1500);
      } else {
        fondoMes = 0;
        ahorroMes = 200;
      }

      ahorroAcumulado += ahorroMes;
      const totalAcumulado = fondoEmergencia + ahorroAcumulado;

      projectionData.push({
        mes,
        ingresos,
        gastos,
        ahorroMes,
        fondoEmergencia,
        ahorroAcumulado,
        totalAcumulado
      });
    }
    return projectionData;
  };

  const downloadCSV = (): void => {
    let csv = 'Categoria,Concepto,Monto,Notas\n';
    csv += 'Ingreso,Salario Bruto,1000,Ingreso principal\n';
    csv += 'Deduccion,Impuestos y deducciones,-100,10% del bruto\n';
    csv += 'Ingreso Neto,Total disponible,900,Despues de deducciones\n';
    csv += 'Gasto Fijo,Financiamiento Auto,-272,1° de cada mes\n';
    csv += 'Gasto Fijo,Celular,-26,1° de cada mes\n';
    csv += 'Gasto Fijo,Internet,-39,15 de cada mes\n';
    csv += 'Gasto Fijo,Seguro Auto,-42,1° de cada mes\n';
    csv += 'Gasto Variable,Gasolina,-120,Semanal ~$30\n';
    csv += 'Gasto Variable,Mantenimiento Auto,-31.25,Cada 4 meses\n';
    csv += 'Ahorro,Fondo de Emergencia,-250,Primeros 6 meses\n';
    csv += 'Ahorro,Ahorro a largo plazo,-50,Continuo\n';
    csv += 'Gastos Personales,Entretenimiento,-69.75,Disponible\n';

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan_financiero.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const TabButton: React.FC<{
    tabId: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }> = ({ children, isActive, onClick }) => (
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

  const MetricCard: React.FC<{
    value: string;
    label: string;
    color?: string;
  }> = ({ value, label, color = "blue" }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className={`text-3xl font-bold mb-2 ${
        color === 'green' ? 'text-green-600' : 
        color === 'red' ? 'text-red-600' : 
        color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
      }`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 uppercase font-semibold">{label}</div>
    </div>
  );

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-light mb-4">🎯 Tu Situación Financiera Actual</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard value="$900" label="Ingreso Mensual Neto" color="green" />
                <MetricCard value="$530.25" label="Gastos Totales" color="red" />
                <MetricCard value="$369.75" label="Disponible Mensual" color="green" />
                <MetricCard value="41%" label="Tasa de Ahorro Potencial" color="yellow" />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">📋 Plan Recomendado de Distribución</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left">Destino</th>
                    <th className="p-4 text-left">Monto Mensual</th>
                    <th className="p-4 text-left">Porcentaje</th>
                    <th className="p-4 text-left">Prioridad</th>
                    <th className="p-4 text-left">Meta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🚨 Fondo de Emergencia</td>
                    <td className="p-4 font-semibold text-green-600">$250.00</td>
                    <td className="p-4">67.6%</td>
                    <td className="p-4 text-red-600 font-semibold">ALTA</td>
                    <td className="p-4">$1,500 en 6 meses</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">💰 Ahorro a Largo Plazo</td>
                    <td className="p-4 font-semibold text-green-600">$50.00</td>
                    <td className="p-4">13.5%</td>
                    <td className="p-4 text-yellow-600 font-semibold">MEDIA</td>
                    <td className="p-4">$600 anuales</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🎯 Gastos Personales</td>
                    <td className="p-4 font-semibold text-yellow-600">$69.75</td>
                    <td className="p-4">18.9%</td>
                    <td className="p-4 text-gray-600 font-semibold">BAJA</td>
                    <td className="p-4">Entretenimiento</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-4">Progreso del Fondo de Emergencia</h4>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full" style={{width: '0%'}}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Meta: $1,500 | Actual: $0</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={downloadCSV}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                type="button"
              >
                📥 Descargar Datos CSV
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                type="button"
              >
                📄 Imprimir Reporte
              </button>
            </div>
          </div>
        );

      case 'seguimiento':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">📅 Seguimiento y Control Mensual</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Seguimiento:</label>
              <input 
                type="month" 
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                defaultValue="2024-09"
              />
            </div>

            <h4 className="text-lg font-semibold mb-4">💰 Registro de Ingresos</h4>
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
            <button
              onClick={addIncome}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-8"
              type="button"
            >
              ➕ Agregar Ingreso
            </button>

            <h4 className="text-lg font-semibold mb-4">💸 Registro de Gastos</h4>
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
            <button
              onClick={addExpense}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-8"
              type="button"
            >
              ➕ Agregar Gasto
            </button>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-light mb-4">📊 Resumen del Mes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard value={`$${totalIncome.toFixed(2)}`} label="Ingresos del Mes" color="green" />
                <MetricCard value={`$${totalExpenses.toFixed(2)}`} label="Gastos del Mes" color="red" />
                <MetricCard 
                  value={`$${monthlyBalance.toFixed(2)}`} 
                  label="Balance del Mes" 
                  color={monthlyBalance >= 0 ? "green" : "red"} 
                />
              </div>
            </div>
          </div>
        );

      case 'calculadora':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">🧮 Herramientas y Calculadoras</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-center">💰 Calculadora de Ahorros</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto a Ahorrar Mensual:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.monthlySaving}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        monthlySaving: parseFloat(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meses:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.savingMonths}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        savingMonths: parseInt(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="1"
                    />
                  </div>
                  <div className="text-center pt-4">
                    <div className="text-3xl font-bold text-green-600">
                      ${(calculatorValues.monthlySaving * calculatorValues.savingMonths).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Ahorrado</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-center">⏰ Tiempo para Meta</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta de Ahorro:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.savingGoal}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        savingGoal: parseFloat(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ahorro Mensual:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.monthlyAmount}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        monthlyAmount: parseFloat(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      step="0.01"
                    />
                  </div>
                  <div className="text-center pt-4">
                    <div className="text-3xl font-bold text-yellow-600">
                      {calculatorValues.monthlyAmount === 0 
                        ? '∞' 
                        : Math.ceil(calculatorValues.savingGoal / calculatorValues.monthlyAmount)} meses
                    </div>
                    <div className="text-sm text-gray-500">Tiempo Necesario</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-center">🚨 Fondo de Emergencia</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gastos Mensuales:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.emergencyExpenses}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        emergencyExpenses: parseFloat(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meses de Cobertura:
                    </label>
                    <input
                      type="number"
                      value={calculatorValues.emergencyMonths}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        emergencyMonths: parseInt(e.target.value) || 0
                      })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="1"
                      max="12"
                    />
                  </div>
                  <div className="text-center pt-4">
                    <div className="text-3xl font-bold text-red-600">
                      ${(calculatorValues.emergencyExpenses * calculatorValues.emergencyMonths).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Fondo Recomendado</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-4">📝 Notas y Recordatorios</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none resize-vertical"
                placeholder="Escribe aquí tus notas financieras, metas específicas, recordatorios importantes, etc."
              />
              <button
                onClick={() => {
                  const blob = new Blob([notes], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'notas_financieras.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                  alert('¡Notas guardadas exitosamente!');
                }}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                type="button"
              >
                💾 Guardar Notas
              </button>
            </div>
          </div>
        );

      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <h1 className="text-4xl font-light mb-2">💰 Plan Financiero Personal</h1>
          <p className="text-gray-300">Análisis completo y herramientas de seguimiento</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap bg-gray-200">
          <TabButton
            tabId="resumen"
            isActive={activeTab === 'resumen'}
            onClick={() => setActiveTab('resumen')}
          >
            📊 Resumen
          </TabButton>
          <TabButton
            tabId="seguimiento"
            isActive={activeTab === 'seguimiento'}
            onClick={() => setActiveTab('seguimiento')}
          >
            📅 Seguimiento Mensual
          </TabButton>
          <TabButton
            tabId="calculadora"
            isActive={activeTab === 'calculadora'}
            onClick={() => setActiveTab('calculadora')}
          >
            🧮 Calculadora
          </TabButton>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-50 min-h-screen">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default App;