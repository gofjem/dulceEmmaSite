import 'dotenv/config'
import { mkdir, writeFile } from 'node:fs/promises'
import { getSupabase } from '../api/_lib/supabase.js'

const TABLAS = ['pedidos', 'productos', 'promociones']
const POR_PAGINA = 1000 // máximo que Supabase devuelve por consulta

async function descargar(supabase, tabla) {
  const filas = []
  for (;;) {
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .order('id')
      .range(filas.length, filas.length + POR_PAGINA - 1)
    if (error) throw new Error(`${tabla}: ${error.message}`)
    filas.push(...data)
    if (data.length < POR_PAGINA) return filas
  }
}

const supabase = getSupabase()
const copia = {}
// Descarga todo antes de escribir: si algo falla, no pisa un backup bueno del mismo día
for (const tabla of TABLAS) copia[tabla] = await descargar(supabase, tabla)

const carpeta = `backups/${new Date().toLocaleDateString('sv')}`
await mkdir(carpeta, { recursive: true })
for (const tabla of TABLAS) {
  await writeFile(`${carpeta}/${tabla}.json`, JSON.stringify(copia[tabla], null, 2))
  console.log(`${tabla}: ${copia[tabla].length} filas`)
}
console.log(`Backup guardado en ${carpeta}`)
