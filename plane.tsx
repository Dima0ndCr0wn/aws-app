import React, { useState, useEffect } from 'react';

const FinancialPlannerApp = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [incomes, setIncomes] = useState([
    { id: 1, date: '2024-09-01', concept: 'Salario Neto', amount: 900 }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-09-01', concept: 'Financiamiento Auto', amount: 272, category: 'Transporte' },
    { id: 2, date: '2024-09-01', concept: 'Celular', amount: 26, category: 'Servicios' },
    { id: 3, date: '2024-09-15', concept: 'Internet', amount: 39, category: 'Servicios' },
    { id: 4, date: '2024-09-01', concept: 'Seguro Auto', amount: 42, category: 'Transporte' }
  ]);
  const [notes, setNotes] = useState(`- Revisar gastos cada semana
- Meta: Fondo de emergencia de $1,500 en 6 meses  
- Investigar opciones de inversión después del mes 6
- Buscar formas de generar ingresos adicionales`);

  const [calculatorValues, setCalculatorValues] = useState({
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
  const availableMoney = 900 - 530.25; // Datos base
  const monthlyBalance = totalIncome - totalExpenses;

  const addIncome = () => {
    const newIncome = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0
    };
    setIncomes([...incomes, newIncome]);
  };

  const addExpense = () => {
    const newExpense = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: 0,
      category: 'Personal'
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(income => 
      income.id === id ? { ...income, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : income
    ));
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : expense
    ));
  };

  const generateProjectionData = () => {
    const projectionData = [];
    let fondoEmergencia = 0;
    let ahorroAcumulado = 0;

    for (let mes = 1; mes <= 12; mes++) {
      const ingresos = 900;
      const gastos = 530.25;
      let ahorroMes, fondoMes;

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

  const downloadCSV = () => {
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

  const TabButton = ({ tabId, children, isActive, onClick }) => (
    <button
      className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
        isActive 
          ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const MetricCard = ({ value, label, color = "blue" }) => (
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

  const renderTabContent = () => {
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
              >
                📥 Descargar Datos CSV
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                📄 Imprimir Reporte
              </button>
            </div>
          </div>
        );

      case 'ingresos-gastos':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">💰 Análisis Detallado de Ingresos y Gastos</h3>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-8">
              <h3 className="text-xl font-light mb-4">📈 Ingresos Mensuales</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-400">
                      <th className="p-3 text-left">Concepto</th>
                      <th className="p-3 text-left">Monto</th>
                      <th className="p-3 text-left">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">Salario Bruto</td>
                      <td className="p-3 font-semibold">$1,000.00</td>
                      <td className="p-3">Ingreso principal</td>
                    </tr>
                    <tr>
                      <td className="p-3">Deducciones (10%)</td>
                      <td className="p-3 font-semibold">-$100.00</td>
                      <td className="p-3">Impuestos y deducciones</td>
                    </tr>
                    <tr className="bg-green-500 font-bold">
                      <td className="p-3">INGRESO NETO TOTAL</td>
                      <td className="p-3">$900.00</td>
                      <td className="p-3">Dinero disponible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-4">📊 Gastos Fijos Mensuales</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left">Concepto</th>
                    <th className="p-4 text-left">Monto</th>
                    <th className="p-4 text-left">Fecha de Pago</th>
                    <th className="p-4 text-left">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🚗 Financiamiento Auto</td>
                    <td className="p-4 font-semibold text-red-600">$272.00</td>
                    <td className="p-4">1° de cada mes</td>
                    <td className="p-4">Fijo</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">📱 Celular</td>
                    <td className="p-4 font-semibold text-red-600">$26.00</td>
                    <td className="p-4">1° de cada mes</td>
                    <td className="p-4">Fijo</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🌐 Internet</td>
                    <td className="p-4 font-semibold text-red-600">$39.00</td>
                    <td className="p-4">15 de cada mes</td>
                    <td className="p-4">Fijo</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🛡️ Seguro Auto</td>
                    <td className="p-4 font-semibold text-red-600">$42.00</td>
                    <td className="p-4">1° de cada mes</td>
                    <td className="p-4">Fijo</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">⛽ Gasolina</td>
                    <td className="p-4 font-semibold text-red-600">$120.00</td>
                    <td className="p-4">Semanal (~$30)</td>
                    <td className="p-4">Variable</td>
                  </tr>
                  <tr className="border-b hover:bg-blue-50">
                    <td className="p-4">🔧 Mantenimiento Auto</td>
                    <td className="p-4 font-semibold text-red-600">$31.25</td>
                    <td className="p-4">Cada 4 meses</td>
                    <td className="p-4">Variable</td>
                  </tr>
                  <tr className="bg-yellow-200 font-bold">
                    <td className="p-4">TOTAL GASTOS</td>
                    <td className="p-4 text-red-600">$530.25</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-100 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold mb-4">✅ Resumen Final</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$900.00</div>
                  <div className="text-sm text-gray-600">Ingresos Netos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">$530.25</div>
                  <div className="text-sm text-gray-600">Gastos Totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$369.75</div>
                  <div className="text-sm text-gray-600">DINERO DISPONIBLE</div>
                </div>
              </div>
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

      case 'proyeccion':
        const projectionData = generateProjectionData();
        
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">📈 Proyección Financiera a 12 Meses</h3>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg mb-8">
              <h3 className="text-xl font-light mb-4">🎯 Objetivos del Año</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2">
                    <span className="font-semibold">🚨 Fondo de Emergencia: $1,500</span>
                    <span className="text-sm ml-2">(6 meses)</span>
                  </div>
                  <div className="w-full bg-purple-400 rounded-full h-4">
                    <div className="bg-green-400 h-4 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="font-semibold">💰 Ahorro a Largo Plazo: $1,200</span>
                    <span className="text-sm ml-2">(12 meses)</span>
                  </div>
                  <div className="w-full bg-purple-400 rounded-full h-4">
                    <div className="bg-blue-400 h-4 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-4">📅 Proyección Mes a Mes</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="p-3 text-left">Mes</th>
                    <th className="p-3 text-left">Ingresos</th>
                    <th className="p-3 text-left">Gastos</th>
                    <th className="p-3 text-left">Ahorro Mes</th>
                    <th className="p-3 text-left">Fondo Emergencia</th>
                    <th className="p-3 text-left">Ahorro Acumulado</th>
                    <th className="p-3 text-left">Total Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((data, index) => (
                    <tr key={index} className="border-b hover:bg-purple-50">
                      <td className="p-3 font-semibold">Mes {data.mes}</td>
                      <td className="p-3 text-green-600 font-semibold">${data.ingresos}</td>
                      <td className="p-3 text-red-600 font-semibold">${data.gastos.toFixed(2)}</td>
                      <td className="p-3 text-blue-600 font-semibold">${data.ahorroMes}</td>
                      <td className="p-3 text-green-600 font-semibold">${data.fondoEmergencia}</td>
                      <td className="p-3 text-blue-600 font-semibold">${data.ahorroAcumulado}</td>
                      <td className="p-3 text-purple-600 font-bold">${data.totalAcumulado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                rows="6"
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
            tabId="ingresos-gastos"
            isActive={activeTab === 'ingresos-gastos'}
            onClick={() => setActiveTab('ingresos-gastos')}
          >
            💸 Ingresos & Gastos
          </TabButton>
          <TabButton
            tabId="seguimiento"
            isActive={activeTab === 'seguimiento'}
            onClick={() => setActiveTab('seguimiento')}
          >
            📅 Seguimiento Mensual
          </TabButton>
          <TabButton
            tabId="proyeccion"
            isActive={activeTab === 'proyeccion'}
            onClick={() => setActiveTab('proyeccion')}
          >
            📈 Proyección 12 Meses
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

export default FinancialPlannerApp;