// Script de redirección opcional: añade un retardo y redirige a /game/index.html
// Inserta este script en la página principal del proyecto (antes de </body>). Si no se encuentra, no modificar.
(function () {
  const segundos = 6; // espera 6 segundos antes de redirigir
  const destino = "/game/index.html"; // ruta del juego dentro del repo
  console.log(`Redirigiendo al juego en ${segundos} segundos...`);
  setTimeout(() => {
    window.location.href = destino;
  }, segundos * 1000);
})();
