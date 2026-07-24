# Pokédex Frontend - Angular 17+

Una aplicación web para prueba tecnica de la gestión de entrenadores y sus colecciones de Pokémon de la 1ª Generación.

## Características Principales y Diseño de Interfaz

* **Perfiles de Entrenador y Sesiones:** Pantalla de bienvenida para seleccionar o cambiar de entrenador activo, adaptando el panel de control de forma dinámica.
* **Operaciones CRUD Completas:** Registro de nuevos Pokémon, aumento de nivel y eliminación ("liberación") de registros.
* **Visuales Dinámicas de la 1ª Generación:** 
  * Las tarjetas heredan de manera dinámica los colores clásicos de tipo de la Gen 1 (por ejemplo, Fuego es naranja, Agua es azul, Fantasma es morado) mediante la vinculación de estilos en línea (`[style.backgroundColor]`)[cite: 7].
  * Integración con sprites originales en *pixel art* de Game Boy obtenidos en vivo desde Pokémon Showdown según el nombre del Pokémon[cite: 5, 8].
  * Manejo de respaldo hacia un ícono SVG personalizado de Pokébola (`Pokeicon.svg`) en caso de que un sprite falle al cargar[cite: 7, 8].
* **Diseño de Panel en 3 Filas Estructuradas:**
  * **Fila 1:** Formulario de registro responsivo de ancho completo.
  * **Fila 2:** Controles distribuidos lado a lado para búsqueda en tiempo real por nombre, filtrado por tipo de la Gen 1 y opciones de ordenamiento (alfabético o por nivel)[cite: 7, 8].
  * **Fila 3:** Cuadrícula responsiva que muestra tarjetas dinámicas con barras de vida/HP calculadas según el nivel[cite: 7, 8].
* **Suite de Pruebas:** Configurada con módulos de prueba de Angular y utilidades de pruebas HTTP (`app.component.spec.ts`).

## Tecnologías Utilizadas

* **Angular** (Arquitectura de componentes *standalone*)[cite: 5, 8]
* **TypeScript**[cite: 5, 8]
* **RxJS**[cite: 3, 5, 8]
* **HTML5 / CSS3** (Flexbox, cuadrículas responsivas, estilos personalizados)[cite: 6, 9]
* **Angular Forms & HTTP Client**[cite: 3, 5, 8]

## Primeros Pasos e Instalación

1. Asegúrate de tener Node.js y Angular CLI instalados.
2. Clona el repositorio del frontend e instala las dependencias:
   ```bash
   npm install
3. En al consola del proyecto ejecuta: `ng serve -o`
