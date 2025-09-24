# 💰 Plan Financiero Personal

Una aplicación web completa para la gestión y planificación de finanzas personales, desarrollada con React y TypeScript.

![Financial Planner](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-blue)

## 🌟 Características

- **📊 Dashboard Completo**: Resumen visual de ingresos, gastos y ahorros
- **💸 Gestión de Ingresos y Gastos**: Registro detallado con categorización
- **📅 Seguimiento Mensual**: Control y monitoreo de finanzas mes a mes
- **📈 Proyecciones a 12 Meses**: Planificación financiera a largo plazo
- **🧮 Calculadoras Financieras**: Herramientas para cálculo de ahorros
- **📝 Notas y Recordatorios**: Sistema de notas integrado
- **📥 Exportación de Datos**: Descarga de informes en formato CSV
- **📱 Diseño Responsivo**: Optimizada para todos los dispositivos

## 🚀 Instalación Rápida

1. **Extraer el proyecto:**
```bash
# Extrae el archivo ZIP descargado
# Navega a la carpeta del proyecto
cd financial-planner-app
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar desarrollo:**
```bash
npm start
```

4. **Construir para producción:**
```bash
npm run build
```

## 🌐 Despliegue en AWS Amplify

### Método 1: Con Git (Recomendado)
1. Sube el proyecto a GitHub
2. Ve a AWS Amplify Console
3. Conecta tu repositorio
4. ¡Deploy automático!

### Método 2: Deploy Manual
1. Ejecuta `npm run build`
2. Sube la carpeta `build` a Amplify

## 📁 Estructura del Proyecto

```
financial-planner-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.tsx              # Componente principal
│   ├── index.tsx            # Punto de entrada
│   ├── index.css            # Estilos globales
│   └── react-app-env.d.ts   # Tipos TypeScript
├── package.json             # Dependencias
├── tsconfig.json            # Config TypeScript
├── tailwind.config.js       # Config Tailwind
└── amplify.yml              # Config Amplify
```

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **AWS Amplify** - Hosting y CI/CD
- **Web Vitals** - Métricas de rendimiento

## 📊 Funcionalidades

### Dashboard Principal
- Métricas financieras clave
- Distribución recomendada de ingresos
- Progreso de metas de ahorro

### Gestión Financiera
- Registro de ingresos y gastos
- Categorización automática
- Edición en tiempo real

### Herramientas
- Calculadora de ahorros
- Calculadora de tiempo para metas
- Calculadora de fondo de emergencia

### Reportes
- Exportación a CSV
- Impresión de reportes
- Proyecciones a 12 meses

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature
3. Commit tus cambios
4. Push y crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

⭐ **¡Dale una estrella si te fue útil!**

## 🆘 Soporte

Si tienes problemas:

1. Verifica que Node.js >= 16 esté instalado
2. Ejecuta `npm install` nuevamente
3. Revisa la consola por errores
4. Consulta la documentación de React

¡Feliz coding! 🚀