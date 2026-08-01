import 'dotenv/config'
import express from 'express'
import pedidosIndex from './api/pedidos/index.js'
import pedidosById from './api/pedidos/[id].js'
import productosIndex from './api/productos/index.js'
import productosById from './api/productos/[id].js'

const app = express()
app.use(express.json())

app.all('/api/productos', productosIndex)
app.all('/api/productos/:id', (req, res) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query, id: req.params.id },
    writable: true, configurable: true,
  })
  productosById(req, res)
})
app.all('/api/pedidos', pedidosIndex)
app.all('/api/pedidos/:id', (req, res) => {
  // Express 5: req.query es un getter que re-parsea cada acceso, no es mutable.
  // Sombreamos con un valor plano para que el handler lo lea correctamente.
  Object.defineProperty(req, 'query', {
    value: { ...req.query, id: req.params.id },
    writable: true,
    configurable: true,
  })
  pedidosById(req, res)
})

app.listen(3001, () => console.log('API corriendo en http://localhost:3001'))
