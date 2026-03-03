// Redirige a game/index.html tras 4 segundos
// Inserta este script en gato.html antes de </body>.
(function () {
  const segundos = 4;
  const destino = "game/index.html";
  console.log(`Redirigiendo al juego en ${segundos} segundos...`);
  setTimeout(() => {
    window.location.href = destino;
  }, segundos * 1000);
})();
