# Clima Bolivia

Aplicación web para consultar el pronóstico de los próximos 7 días en las 9 ciudades capitales departamentales de Bolivia: Sucre, La Paz, Cochabamba, Oruro, Potosí, Tarija, Santa Cruz de la Sierra, Trinidad y Cobija.

La interfaz está inspirada en el mockup [Weather Website](https://www.figma.com/design/18vFvNXXcEUyXrpFM3MH99/Weather-Website?node-id=0-1) (Weather Now): fondo oscuro, tarjeta actual con degradado, métricas, grilla de 7 días y panel horario.

## Cómo ejecutar el proyecto

Requisitos: Node.js 20 o superior.

```bash
git clone https://github.com/NoemiCalizaya/weather_webApp.git
cd weather_webApp
npm install
```

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example` como base) con la URL del endpoint de Open-Meteo:

```env
VITE_OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
```

Luego inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre la URL que muestre Vite (por lo general `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # genera la versión de producción en dist/
npm run preview  # sirve el build localmente
npm run lint     # ejecuta ESLint
npm run test     # ejecuta los tests con Vitest
```

No hace falta API key, pero se creó el archivo `.env` para la URL de la API, de modo que un cambio de versión del endpoint (por ejemplo, de `v1` a `v2`) no requiera tocar el código fuente.

Aplicación desplegada públicamente en Vercel:

- URL: https://webappboliviaweather.vercel.app/

## Tecnologías

- **React 19** y **TypeScript**: interfaz y tipado del contrato de la API.
- **Vite**: entorno de desarrollo y empaquetado.
- **Tailwind CSS v4**: estilos alineados a la paleta del mockup.
- **Vitest** y **React Testing Library**: pruebas unitarias de la lógica y los componentes.
- **Open-Meteo Forecast API**: datos de clima.

## API utilizada

[Open-Meteo Forecast API](https://open-meteo.com/en/docs)

Endpoint principal (configurable mediante variable de entorno, ver sección anterior):

`https://api.open-meteo.com/v1/forecast`

Parámetros usados:

- `latitude` / `longitude` de cada capital
- `timezone=America/La_Paz`
- `forecast_days=7`
- `current`: temperatura, sensación térmica, humedad, viento, precipitación, código WMO e `is_day` (día/noche)
- `daily`: código WMO, temperatura máxima y mínima
- `hourly`: temperatura, código WMO e `is_day` por hora

Las coordenadas están fijas en el código porque las 9 ciudades son un conjunto cerrado; no se usa geocoding.

## Por qué esta API

Open-Meteo cumple los requerimientos principales pedidos para el desarrollo de la aplicación y se ajusta bien a los elementos definidos en el mockup:

- No requiere clave ni registro.
- Permite CORS desde el navegador, así que no hace falta un backend.
- Devuelve pronóstico diario de 7 días (el valor por defecto) con códigos WMO estándar.
- Es gratuita para uso razonable no comercial.

Inicialmente se intentó usar la API sugerida, OpenWeather, pero el endpoint de pronóstico diario a 7 días (One Call API 3.0/4.0) devolvió un error 401 al consumirlo:

\`\`\`json
{
    "cod": 401,
    "message": "Please note that using One Call 4.0 requires a separate subscription to the One Call by Call plan..."
}
\`\`\`

Es decir, ese endpoint específico requiere una suscripción paga aparte del plan gratuito estándar de OpenWeather (que solo cubre pronóstico de 5 días en intervalos de 3 horas, insuficiente para el requisito de 7 días diarios). Dado que el enunciado permite usar cualquier API pública alternativa, se optó por Open-Meteo, que cubre el requisito de 7 días sin costo ni registro.

## Ventajas y limitaciones

**Ventajas**

- Respuesta rápida y un solo request por ciudad.
- Códigos WMO permiten mapear condición e ícono de forma estable, incluyendo variantes de día y de noche mediante el campo `is_day`.
- Se puede pedir `current`, `daily` y `hourly` en la misma petición.
- La zona horaria de Bolivia se aplica en el servidor (`America/La_Paz`).

**Limitaciones**

- No busca ciudades por nombre: hay que enviar latitud y longitud.
- La resolución espacial del modelo puede no coincidir exactamente con el centro urbano.
- No hay autenticación; si el servicio está caído, la app solo puede reintentar.
- Los textos de condición climática son una interpretación local de los códigos WMO, no un campo de texto que entregue la API directamente.
- El campo `is_day` solo tiene sentido para datos puntuales (`current` y cada hora de `hourly`); el pronóstico `daily` es un resumen de 24 horas y no distingue día/noche.

## Decisiones técnicas

- **Ciudades predefinidas en lugar de buscador**: el enunciado pide las 9 capitales, no búsqueda libre. El selector reemplaza el buscador del mockup y mantiene el mismo lugar visual.
- **Una petición por ciudad, con caché en memoria**: cambiar de ciudad es inmediato si ya se consultó antes; si falla una, las demás no se ven afectadas.
- **Lógica de datos extraída a un custom hook (`useForecast`)**: la obtención del pronóstico, el manejo de caché, estado de carga/error y reintento viven en un hook independiente de `App.tsx`, separando la lógica de datos de la capa de presentación. Esto facilita reutilizar la misma lógica si en el futuro se agrega otra vista (por ejemplo, comparar dos ciudades a la vez) sin duplicar código.
- **URL de la API en variable de entorno**: `VITE_OPEN_METEO_URL` se lee desde `.env` en vez de estar hardcodeada, para poder apuntar a otra versión del endpoint sin modificar el código fuente.
- **Manejo de errores diferenciado por tipo**: se distinguen fallos de red (sin conexión, timeout), respuestas HTTP no exitosas (leyendo el `reason` que Open-Meteo entrega en sus errores 400) y JSON incompleto o mal formado, cada uno con un mensaje claro para el usuario y un botón de reintento.
- **Conversión de unidades en el cliente**: se pide todo en métrico y se convierte a imperial en el frontend para no repetir llamadas a la API.
- **UI en español y zona horaria `America/La_Paz`**: fechas y horas coherentes con Bolivia.
- **Sin backend**: Vite + fetch directo a Open-Meteo es suficiente y más simple de desplegar.
- **Pruebas unitarias con Vitest**: se priorizó testear la lógica pura y con mayor riesgo de bugs silenciosos (mapeo de códigos climáticos y parseo/manejo de errores de la API), en lugar de componentes puramente visuales.

## Datos mostrados

Por ciudad se muestra:

- Fecha
- Temperatura máxima y mínima de cada uno de los 7 días
- Condición climática (texto + ícono, con variante de día/noche cuando aplica)
- Temperatura actual, sensación térmica, humedad, viento y precipitación
- Pronóstico por hora del día seleccionado

# AI Usage

## Herramientas de IA utilizadas

Cursor, Claude y ChatGPT.

## Para qué las utilicé

Se usaron para acelerar el desarrollo, investigar documentación de TypeScript y React, comparar APIs de clima públicas y elegir la que mejor cumplía los requisitos del reto, corregir errores de lógica, y recibir retroalimentación sobre decisiones de mantenibilidad y escalabilidad del proyecto.

## Cómo utilicé IA durante el desarrollo

Se usó Cursor para desarrollar la aplicación desde cero: se le proporcionaron los mockups de referencia junto con la documentación de la API de Open-Meteo, para que interpretara correctamente sus endpoints y parámetros (current, daily, hourly) y generara la estructura inicial del proyecto. Esto permitió agilizar significativamente el arranque del desarrollo, en lugar de partir de cero manualmente.

A partir de esa base, se trabajó de forma iterativa con Claude y ChatGPT: se fueron compartiendo archivos reales del proyecto para pedir revisión puntual —en vez de aceptar código genérico sin verificarlo contra la implementación existente— corrigiendo según criterio propio de lógica y buenas prácticas de React, como la separación de responsabilidades entre componentes y lógica de datos, el manejo correcto de errores de la API, y ajustes de tipado en TypeScript. También se usaron estas herramientas para resolver dudas puntuales de configuración del entorno (Vite, Tailwind, variables de entorno), para plantear cómo estructurar cambios que afectaban a varios archivos a la vez (por ejemplo, agregar soporte de íconos día/noche), y para recibir retroalimentación sobre decisiones específicas de mantenibilidad y escalabilidad a medida que el proyecto avanzaba.

## Ejemplo de algo generado o sugerido por IA que tuve que revisar o corregir

- **Manejo de errores de red y de la API**: la primera versión de la función de fetch chequeaba si la respuesta HTTP no era exitosa (`response.ok`) y lanzaba un error genérico con el código de estado, pero tenía código después de ese bloque que intentaba leer el motivo específico del error (`reason`) desde el cuerpo de la respuesta. Ese código nunca llegaba a ejecutarse, porque el error genérico se lanzaba antes de leer el cuerpo. Se corrigió leyendo primero el cuerpo de la respuesta y diferenciando entre errores de validación (400, con mensaje específico de la API), errores del servidor (5xx) y fallos de red genéricos.
- **Íconos de clima para el día y la noche**: Open-Meteo no distingue día/noche en el código climático (WMO) en sí, pero sí entrega un campo aparte (`is_day`) para saber si corresponde mostrar sol o luna en cada momento puntual. Fue necesario identificar en qué componentes tenía sentido aplicar esa variante (la vista actual y el pronóstico por hora) y en cuál no (el resumen diario de 7 días, que al ser un promedio de 24 horas no representa un momento específico del día).

## Qué parte del proyecto requirió más razonamiento propio

Buscar una alternativa a la API sugerida (OpenWeather) que cumpliera los requerimientos sin costo: la documentación de las distintas opciones no siempre era clara sobre qué endpoints requerían pago, así que se usó la IA para agilizar esa comparación, pero la decisión final y la verificación de que Open-Meteo realmente cubría los 7 días de pronóstico sin autenticación fue un criterio propio.

También requirió criterio propio decidir qué archivos del proyecto necesitaban actualizarse al introducir el campo is_day: no era un cambio uniforme para todo el proyecto, sino que dependía de si cada componente mostraba un dato puntual en el tiempo o un resumen agregado.

Otro punto que exigió criterio propio fue mejorar la usabilidad de la interfaz más allá de lo generado inicialmente: reorganizar la tarjeta de clima actual para que el ícono, la temperatura y la condición climática quedaran agrupados como una sola unidad visual, agregar las etiquetas de texto "Máx" y "Mín" junto a las temperaturas del pronóstico de 7 días (para que el usuario no tuviera que inferir cuál era cuál solo por el peso visual), y diferenciar el ícono y la descripción del clima según si es de día o de noche.

## Sugerencias de IA que sí utilicé, inicialmente descartadas

Al principio no se planeaba usar variables de entorno (dado que Open-Meteo no requiere API key) ni extraer la lógica de datos a un custom hook. Tras evaluar los beneficios para la mantenibilidad del proyecto —poder cambiar la versión del endpoint sin tocar código, y separar la lógica de obtención de datos de la capa de presentación— se decidió incorporar ambas sugerencias.

## Sugerencias de IA que no utilicé

Se sugirió automatizar la resolución de coordenadas de las ciudades mediante la API de geocoding de Open-Meteo, en lugar de mantenerlas fijas en el código. Se descartó esta opción porque las 9 ciudades son un conjunto cerrado y conocido de antemano: el geocoding dinámico solo agregaría una dependencia externa adicional y un punto de falla más, sin ningún beneficio real para este caso de uso.