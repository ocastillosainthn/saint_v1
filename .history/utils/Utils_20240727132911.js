export function formatDate(dateString) {
  if (!dateString) return 'Sin salida registrada'; // Verifica si la fecha está vacía o nula
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}
