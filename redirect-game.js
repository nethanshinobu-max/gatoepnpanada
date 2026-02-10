// Script de redirección: 4 segundos y redirige a game/index.html
// Inserta este script en la página principal gato.html antes de </body>.
(function () {
  const segundos = 4; // espera 4 segundos antes de redirigir
  const destino = "game/index.html"; // ruta relativa del juego dentro del repo
  console.log(`Redirigiendo al juego en ${segundos} segundos...`);
  setTimeout(() => {
    window.location.href = destino;
  }, segundos * 1000);
})();
