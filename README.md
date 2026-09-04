# Yachay Tech Campus Explorer

**Workshop 3 - Web Applications**
Autores: William Garzon & Freddy Valenzuela

---

## Descripcion del Proyecto

Pagina web interactiva para explorar el campus de la **Yachay Tech University**, ubicada en la Hacienda San Jose, Urcuqui, Imbabura, Ecuador. La universidad fue fundada en 2014 como parte del proyecto Ciudad del Conocimiento y su nombre proviene de la palabra Kichwa que significa "conocimiento".

La pagina ofrece un mapa interactivo del campus, una galeria de fotos, un formulario de contacto adaptativo y un modo oscuro/claro.

---

## Estructura de Archivos

```
aplicaciones-web-Workshop-3-/
|-- index.html              # Pagina principal (HTML5)
|-- style.css               # Estilos (CSS3)
|-- script.js               # Logica interactiva (jQuery 3.7.1)
|-- README.md               # Esta documentacion
|-- assets/                 # Imagenes y recursos
    |-- logo_U.png                   # Logo de Yachay Tech
    |-- senecyt.webp                 # Foto: Edificio Senecyt
    |-- Biblioteca_Universidad_Yachay_Tech_3.jpg  # Foto: Aulas B
    |-- sala-capitular-nueva.jpg     # Foto: Sala Capitular
    |-- Residencias_Departamentos_Bloques_Universidad_Yachay_Tech-1536x1024.jpg
    |-- Residencias_Departamentos_Multifamiliares_Universidad_Yachay_Tech-2048x1365.jpg
    |-- Residencias_Universidad_Yachay_Tech_8.jpg
    |-- historia_mision_vision-1.jpg
    |-- escuela_mate.png             # Logo escuela de Matematicas
    |-- escuela_fisica.png           # Logo escuela de Fisica
    |-- escuela_quim.png             # Logo escuela de Quimica
    |-- escuela_bio.png              # Logo escuela de Biologia
    |-- escuela_geo.png              # Logo escuela de Geologia
    |-- icon-agro.png                # Logo escuela de Ciencias Agricolas
```

---

## Estructura de la Pagina (HTML)

### 1. Barra de Navegacion (`<header class="navbar">`)
- **Logo** de Yachay Tech a la izquierda
- **Menu de navegacion centrado**: Home | Campus Gallery | Contact
- **Boton de modo oscuro** (sol/luna) en la esquina derecha

### 2. Hero Section (`#home`)
- Titulo: "Explore the Yachay Tech Campus"
- Parrafo descriptivo sobre la universidad, su historia, ubicacion e instalaciones
- Boton "View Campus" que pinta la pagina con colores de las escuelas

### 3. Galeria de Fotos (`#gallery`)
- **Grid de 6 fotos** del campus en disposition responsiva:
  - Senecyt (edificio principal)
  - Aulas B (Biblioteca)
  - Sala Capitular
  - Bloques de residencias
  - Multifamiliares
  - Patrimoniales
- **Modal popup**: al hacer clic en cualquier foto se amplia en un modal
- Cerrado con boton X, clic en el fondo, o tecla Escape

### 4. Formulario de Contacto (`#contact`)
Formulario adaptativo con 9 tipos de solicitud:

| Solicitud | Descripcion |
|-----------|-------------|
| `map` | Reportar algo incorrecto en el mapa |
| `tour` | Reservar una visita guiada al campus |
| `booking` | Reservar un espacio en el campus |
| `incident` | Reportar un problema de mantenimiento |
| `photo` | Enviar una foto para la galeria |
| `building` | Preguntar sobre un edificio |
| `route` | Solicitar una ruta accesible |
| `lost` | Objeto perdido/encontrado |
| `other` | Otro tipo de solicitud |

El formulario muestra/oculta campos automaticamente segun la solicitud elegida usando el atributo `data-show-for`.

### 5. Footer
- Copyright de los autores
- Informacion del workshop

---

## Funcionalidades JavaScript (script.js)

### 4.I - Toggle de Color (Freddy Valenzuela)
El boton "View Campus" pinta la pagina con uno de **6 colores** de las escuelas de Yachay:

| Escuela | Color Claro | Color Oscuro |
|---------|-------------|--------------|
| Matematicas | `#fecaca` (rojo) | `#7f1d1d` |
| Fisica | `#fde68a` (amarillo) | `#78350f` |
| Quimica | `#bae6fd` (celeste) | `#0c4a6e` |
| Biologia | `#bbf7d0` (verde) | `#14532d` |
| Ciencias Agricolas | `#99f6e4` (turquesa) | `#134e4a` |
| Geologia | `#e7d3b8` (marron claro) | `#5b4636` |

Cada color tiene un logo de la escuela que se superpone como patron en la pagina.

### 4.II - Galeria de Fotos con Modal (William Garzon)
- Click en foto abre modal con imagen ampliada
- Navegacion con teclado (Tab + Enter/Espacio)
- Cierre con Escape, clic en fondo, o boton X
- El navbar se oculta mientras el modal esta abierto

### 4.III - Formulario Adaptativo con Validacion (William Garzon)
- Muestra/oculta campos segun la solicitud elegida
- Validacion completa de cada campo
- Mensajes de error especificos por campo
- Transiciones suaves al cambiar de solicitud

### Modo Oscuro
- Boton sol/luna en la barra de navegacion
- Persiste la preferencia en `localStorage`
- Cambia todas las variables CSS del tema

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estructura semantica, formularios, accesibilidad |
| **CSS3** | Grid, Flexbox, custom properties, transitions, media queries |
| **jQuery 3.7.1** | Manipulacion del DOM, eventos, validacion |
| **Git/GitHub** | Control de versiones |

---

## Requisitos del Workshop cubiertos

1. **HTML5 semantico**: header, nav, main, section, figure, form, fieldset, etc.
2. **CSS Grid y Flexbox**: galeria en grid, formulario en grid, navbar en flexbox
3. **Hover effects**: navegacion, galeria, botones, fotos
4. **Media queries**: responsividad para tablet (900px) y movil (600px/768px)
5. **Accesibilidad**: skip-link, aria-labels, tabindex, focus-visible, prefers-reduced-motion
6. **jQuery**: eventos, manipulacion de DOM, validacion de formularios
7. **Formulario sin backend**: validacion completa del lado del cliente con novalidate
8. **Modo oscuro**: toggle con persistencia en localStorage

---

## Como Ejecutar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Freddyrex/aplicaciones-web-Workshop-3-.git
   ```
2. Abrir `index.html` en un navegador web
3. No se necesita servidor local ni dependencias额外 (jQuery se carga desde CDN)

---

## Autores

- **William Garzon** - Galeria de fotos, formulario adaptativo, validacion
- **Freddy Valenzuela** - Navbar, hero section, toggle de colores, modo oscuro
