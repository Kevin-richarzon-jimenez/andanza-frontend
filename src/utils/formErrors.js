// Convierte un error de la API en { message, fields } para mostrarlo en un formulario:
// "message" es el texto general y "fields" mapea cada campo con problemas a su mensaje.
export function describeError(error) {
  const fields = {}
  for (const item of error.errors ?? []) {
    if (!(item.field in fields)) fields[item.field] = item.message
  }
  return { message: error.message, fields }
}
