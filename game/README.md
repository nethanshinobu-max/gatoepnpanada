# Gato vs Corazón (Phaser 3)

Mini‑juego 2D donde el gato evita un corazón que rebota y acelera.
- 3 vidas por partida.
- Contador de tiempo en cada vida y total acumulado.
- Acelera en cada choque con la pared.

## Cómo correrlo
1. Abre `game/index.html` directamente en el navegador (o usa Live Server en VS Code).
2. Si usas GitHub Pages, visita `game/index.html`.

## Integración sin romper nada
- Carpeta `game/` añadida en la raíz.
- Archivo `redirect-game.js` para redirección desde `gato.html`.
- No se borra ni reemplaza ningún archivo existente.

## Personalización
- Reemplaza las texturas generadas por código (gato/corazón) con tus sprites PNG.
- Ajusta velocidades en `setHeartVelocity` y `accelerateHeart`.
- Cambia el tiempo de redirección en `redirect-game.js`.
