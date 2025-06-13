import express from 'express'
import DbService from '../services/DbService.js'
import { validateStrings } from '../utils/validations.js'

const dbManager = new DbService()
const router = express.Router()

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addTypeProduct', async (req, res) => {
  const { typeProduct } = req.body

  try {
    // validate types
    validateStrings([typeProduct])

    // insert in db or return existing data
    const data = await dbManager.getRegisters(
      'type_product',
      ['*'],
      [
        {
          columnName: 'type_product_name',
          value: typeProduct
        }
      ]
    )

    if (data[0][0]) {
      res.send(`El type product ${data[0]} ya existe`)
    } else {
      dbManager.insertInDB('type_product', [
        { columnName: 'type_product_name', value: typeProduct }
      ])
      res.send('Success')
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la peticion')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addModel', async (req, res) => {
  const { model, description, idTypeProduct, units } = req.body
  try {
    // validate types
    validateStrings([model, description, idTypeProduct, units])

    // Insert in db or return the existing data
    const data = await dbManager.getRegisters(
      'models',
      ['*'],
      [{ columnName: 'name_model', value: model }]
    )
    if (data[0][0]) {
      res.send('El model ya existe')
    } else {
      dbManager.insertInDB('models', [
        { columnName: 'name_model', value: model },
        { columnName: 'description', value: description },
        { columnName: 'id_type_product', value: idTypeProduct },
        { columnName: 'units', value: units }
      ])
      res.send('model agregado correctamente')
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la peticion')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addProvider', async (req, res) => {
  const { website, tel, email, companyName } = req.body
  try {
    // validate types
    validateStrings([website, tel, email, companyName])

    // Insert in db or return the existing data
    const data = await dbManager.getRegisters(
      'providers',
      ['*'],
      [{ columnName: 'company_name', value: companyName }]
    )
    if (data[0][0]) {
      res.send('El provider ya existe')
    } else {
      dbManager.insertInDB('providers', [
        { columnName: 'website', value: website },
        { columnName: 'tel', value: tel },
        { columnName: 'email', value: email },
        { columnName: 'company_name', value: companyName }
      ])

      res.send('Operacion realizada exitosamente')
    }
  } catch (e) {
    console.error(e)
    res.send(400).send('Error en la peticion')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addProduct', async (req, res) => {
  const { stock, idColor, idProvider, price, idModel, isStock } = req.body

  try {
    // Validate types
    validateStrings([idColor, idProvider, idModel, isStock])

    // Search register in db
    const data = await dbManager.getRegisters(
      'list_products',
      ['*'],
      [
        { columnName: 'id_model', value: idModel },
        { columnName: 'id_color', value: idColor },
        { columnName: 'id_provider', value: idProvider },
        { columnName: 'is_stock', value: isStock }
      ]
    )

    // Insert in db or return the existing data
    if (data[0][0]) {
      res.send(`El producto ${data[0]} ya existe`)
    } else {
      dbManager.insertInDB('list_products', [
        { columnName: 'id_model', value: idModel },
        { columnName: 'id_color', value: idColor },
        { columnName: 'id_provider', value: idProvider },
        { columnName: 'stock', value: stock },
        { columnName: 'price', value: price },
        { columnName: 'is_stock', value: isStock }
      ])
      res.send('Producto agregado correctamente')
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la peticion')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addColor', async (req, res) => {
  const { colorName } = req.body

  try {
    // Insert in db or return the existing data
    const [data] = await dbManager.getRegisters(
      'colors',
      ['*'],
      [{ columnName: 'color_name', value: colorName }]
    )
    if (!data[0]) {
      dbManager.insertInDB('colors', [
        { columnName: 'color_name', value: colorName }
      ])
      res.send('Color agregado correctamente')
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la consulta')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/isLogged', (req, res) => {
  if (req.decoded) {
    res.json({ message: 'isLogged' })
  } else {
    res.json({ message: 'isNotLogged' })
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addCondition', async (req, res) => {
  const { condition } = req.body

  try {
    // Validate req.body
    validateStrings([condition])

    // Insert in db or return the existing data
    const [data] = await dbManager.getRegisters(
      'conditions',
      ['*'],
      [{ columnName: 'condition_name', value: condition }]
    )
    if (data[0]) {
      res.send('La condition ya existe')
    } else {
      dbManager.insertInDB('conditions', [
        { columnName: 'condition_name', value: condition }
      ])
      res.send('Condicion agregado correctamente')
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la consulta')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addClient', async (req, res) => {
  const client = req.body

  try {
    // Validate req.body
    validateStrings([client.name, client.number, client.empresa])

    // Insert in db or return the existing data
    const [data] = await dbManager.getRegisters(
      'clients',
      ['*'],
      [{ columnName: 'name_client', value: client.name }]
    )
    if (data[0]) {
      res.json({ id: data[0].id_client })
    } else {
      await dbManager.insertInDB('clients', [
        { columnName: 'name_client', value: client.name },
        { columnName: 'number', value: client.number },
        { columnName: 'empresa', value: client.empresa }
      ])
      const [data] = await dbManager.getRegisters(
        'clients',
        ['*'],
        [{ columnName: 'name_client', value: client.name }]
      )
      res.json({ id: data[0].id_client })
    }
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la consulta')
  }
})

/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

router.post('/addCotizacion', async (req, res) => {
  const state = req.body
  function getMySQLDateTime() {
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000 // Ajuste por zona horaria
    const localISOTime = new Date(now - offset)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')
    return localISOTime
  }

  try {
    // Insert in db
    dbManager.insertInDB('cotizaciones', [
      { columnName: 'content', value: JSON.stringify(state) },
      { columnName: 'client', value: state.clientSelected },
      { columnName: 'date', value: getMySQLDateTime() }
    ])
    res.send('Cotizacion agregada correctamente')
  } catch (e) {
    console.error(e)
    res.status(400).send('Error en la consulta')
  }
})

export default router
