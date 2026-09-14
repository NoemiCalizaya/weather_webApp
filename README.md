# Clima Bolivia

Aplicación web para consultar el pronóstico de los próximos 7 días en las 9 capitales departamentales de Bolivia: Sucre, La Paz, Cochabamba, Oruro, Potosí, Tarija, Santa Cruz de la Sierra, Trinidad y Cobija.

La interfaz está inspirada en el mockup [Weather Website](https://www.figma.com/design/18vFvNXXcEUyXrpFM3MH99/Weather-Website?node-id=0-1) (Weather Now): fondo oscuro, tarjeta actual con degradado, métricas, grilla de 7 días y panel horario.

## Cómo ejecutar el proyecto

Requisitos: Node.js 20 o superior.

```bash
git clone https://github.com/NoemiCalizaya/weather_webApp.git
cd weather_webApp
npm install
npm run dev
```

Luego abre la URL que muestre Vite (por lo general `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # genera la versión de producción en dist/
npm run preview  # sirve el build localmente
npm run lint     # ejecuta ESLint
```

No hace falta API key ni archivo `.env`.

## Tecnologías

- **React 19** y **TypeScript**: interfaz y tipado del contrato de la API.
- **Vite**: entorno de desarrollo y empaquetado.
- **Tailwind CSS v4**: estilos alineados a la paleta del mockup.
- **Open-Meteo Forecast API**: datos de clima.

## API utilizada

[Open-Meteo Forecast API](https://open-meteo.com/en/docs)

Endpoint principal:

`https://api.open-meteo.com/v1/forecast`

Parámetros usados:

- `latitude` / `longitude` de cada capital
- `timezone=America/La_Paz`
- `forecast_days=7`
- `current`: temperatura, sensación térmica, humedad, viento, precipitación y código WMO
- `daily`: código WMO, temperatura máxima y mínima
- `hourly`: temperatura y código WMO por hora

Las coordenadas están fijas en el código porque las 9 ciudades son un conjunto cerrado; no se usa geocoding.

## Por qué esta API

Open-Meteo es la fuente indicada en el mockup y cubre el requerimiento de una API pública:

- No requiere clave ni registro.
- Permite CORS desde el navegador, así que no hace falta un backend.
- Devuelve pronóstico diario de 7 días (el valor por defecto) con códigos WMO estándar.
- Es gratuita para uso razonable no comercial.

## Ventajas y limitaciones

**Ventajas**

- Respuesta rápida y un solo request por ciudad.
- Códigos WMO permiten mapear condición e icono de forma estable.
- Se puede pedir current, daily y hourly juntos.
- Zona horaria de Bolivia se aplica en el servidor (`America/La_Paz`).

**Limitaciones**

- No busca ciudades por nombre: hay que enviar latitud y longitud.
- La resolución espacial del modelo puede no coincidir con el centro urbano exacto.
- No hay autenticación; si el servicio está caído, la app solo puede reintentar.
- Los textos de condición son una interpretación local de los códigos WMO, no un campo de texto de la API.

## Decisiones técnicas

- **Ciudades predefinidas en lugar de buscador**: el enunciado pide las 9 capitales, no búsqueda libre. El selector reemplaza el search del mockup y mantiene el mismo lugar visual.
- **Una petición por ciudad, con caché en memoria**: cambiar de ciudad es inmediato si ya se consultó; si falla una, las demás no se ven afectadas.
- **Conversión de unidades en el cliente**: se pide todo en métrico y se convierte a imperial para no repetir llamadas.
- **Errores explícitos y reintento**: se distinguen fallos de red, HTTP y JSON incompleto, y hay botón para volver a pedir datos.
- **UI en español y zona `America/La_Paz`**: fechas y horas coherentes con Bolivia.
- **Sin backend**: Vite + fetch directo a Open-Meteo es suficiente y más simple de desplegar.

## Datos mostrados

Por ciudad se muestra:

- Fecha
- Temperatura máxima y mínima de cada uno de los 7 días
- Condición climática (texto + icono)
- Temperatura actual, sensación térmica, humedad, viento y precipitación
- Pronóstico por hora del día seleccionado
