export function formatDate(dateString) {
  if (!dateString) return 'Sin registrada'; 
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}
