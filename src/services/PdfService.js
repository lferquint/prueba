import doDate from '../utils/doDate.js'
import formatNumber from '../utils/formatNumber.js'
import TypeError from '../errors/errors.js'
import {
  calculateIVA,
  calculateSubTotal,
  calculateTotal
} from '../utils/calcuateAmounts.js'

class PdfService {
  constructor(pdfDocument) {
    this.font = 'Helvetica'
    this.pdfDocument = pdfDocument
    this.pendingMessage = 'Pendiente'
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  setFont(newFont) {
    this.font = newFont
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  setDocument(newDocument) {
    this.pdfDocument = newDocument
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  setPendingMessage(text) {
    this.pendingMessage = text
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addText
   * @param {String} text
   */

  addText(text, config) {
    if (typeof text !== 'string') {
      throw new TypeError('text param must be a string')
    }
    this.pdfDocument
      .fillColor('black')
      .font(this.font)
      .fontSize(10)
      .text(text, config)
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * @param {String} text
   */

  addTextBold(text, config) {
    if (typeof text !== 'string') {
      throw new TypeError('text param must be a string')
    }
    this.pdfDocument
      .fillColor('black')
      .fontSize(10)
      .font(`${this.font}-Bold`)
      .text(text, config)
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addNote
   * @param {String} text
   */

  addNote(text) {
    if (typeof text !== 'string') {
      throw new TypeError('text param must be a string')
    }
    this.pdfDocument
      .fillColor('black')
      .fontSize(10)
      .font(`${this.font}-Bold`)
      .text(text, { width: '300' })
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * Obj type header for PDF document.
   * @typedef {Object} objIntroduction
   * @property {string} nameClient
   * @property {string} tel
   * @property {string} company
   * @property {string} place
   * @property {string} introductionMessage
   * addIntroduction
   * @param {objIntroduction} objIntroduction
   */

  addIntroduction(objIntroduction) {
    if (!objIntroduction) objIntroduction = {}
    this.addTextBold(objIntroduction.company || this.pendingMessage) // Company name
    this.addTextBold(
      `ATN. ${objIntroduction.nameClient || this.pendingMessage}`
    ) // Name client
    this.addTextBold(`TEL. ${objIntroduction.tel || this.pendingMessage}`) // Tel client
    this.addText(doDate(new Date()), { align: 'right' }) // Date
    this.pdfDocument.moveDown().moveDown().moveDown()
    this.addText(
      objIntroduction.introductionMessage || 'Por este conducto ponemos a su atenta consideracion la cotizacion de los productos y/o servicios solicitados. '
    ) // Introducion message
    this.pdfDocument.moveDown()
    this.addText(`Obra: ${objIntroduction.place || this.pendingMessage}`) // Project address
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * Obj type header for PDF document.
   * @typedef {Object} headerConfig
   * @property {string} image
   * @property {string} address
   * @property {string} tel
   * @property {string} email
   * addHeader
   * @param {headerConfig} headerConfig
   */

  addHeader(headerConfig) {
    if (!headerConfig) headerConfig = {}
    const topPosition = 45

    this.pdfDocument
      .fontSize(13)
      .font('Courier-Bold')
      .fillColor('gray')
      .text('Division', 260, 45, {
        paragraphGap: 5,
        width: 110,
        align: 'right'
      })
    this.pdfDocument.text('Hospitalaria', {
      paragraphGap: 5,
      width: 110,
      align: 'right'
    })

    this.pdfDocument
      .rect(380, topPosition, 0.5, 80) // Line
      .strokeColor('gray')
      .stroke()

    this.pdfDocument
      .rect(70, topPosition + 90, 470, 0.5) // Line
      .strokeColor('gray')
      .stroke()

    this.pdfDocument.image(
      headerConfig.image || './src/assets/logo.jpg', // Location image
      390, // X position
      topPosition + 25,
      { width: 150 }
    )

    this.pdfDocument
      .fontSize(6)
      .fillColor('black')
      .text(
        headerConfig.address || 'San Francisco No. 9, Col. San Jerónimo Aculco, D.F. ', // Address
        70, // X position
        topPosition + 60,
        { paragraphGap: 10 }
      )

    this.pdfDocument.fontSize(6).text(
      `Tel: ${headerConfig.tel || '(55) 5631-2039'} / Email: ${
        // Tel and email
        headerConfig.email || 'vrintecsistemasdesalud@yahoo.com.mx'
      }`,
      70, // X position
      topPosition + 70,
      { paragraphGap: 10 }
    )

    this.pdfDocument.moveDown()
    this.pdfDocument.moveDown()
    this.pdfDocument.moveDown()
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addAmounts
   * @param {Array.<{nameProduct: string, model: string, amount: number, price: number, description: string, units: string}>} products
   */

  async addAmounts(products, headers) {
    if (!headers) headers = []
    const rowsArray = [] // Table data

    // data products adapter
    for (let i = 0; i < products.length; i++) {
      const row = []
      row.push(
        products[i].description,
        products[i].amount,
        products[i].units,
        formatNumber(products[i].price),
        formatNumber(products[i].amount * products[i].price)
      )
      rowsArray.push(row)
    }

    // table config
    const table = {
      headers: [
        headers[0] || 'Descripcion',
        headers[1] || 'Cantidad',
        headers[2] || 'Unidad',
        headers[3] || 'Precio unitario',
        headers[4] || 'Importe'
      ],
      rows: rowsArray,
      options: {
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          this.pdfDocument.font('Helvetica').fontSize(9).text()
        },
        minRowHeight: 20
      }
    }

    this.pdfDocument.moveDown().moveDown().moveDown()

    // reder table
    await this.pdfDocument.table(table, {
      width: 475,
      columnsSize: [185, 70, 70, 70, 75]
    })

    // costs
    this.addTextBold(`Subtotal ${formatNumber(calculateSubTotal(products))}`, {
      align: 'right',
      lineGap: 5
    })
    this.addTextBold(
      `IVA ${formatNumber(calculateIVA(calculateSubTotal(products)))}`,
      {
        align: 'right',
        lineGap: 5
      }
    )
    this.addTextBold(
      `TOTAL ${formatNumber(calculateTotal(calculateSubTotal(products)))}`,
      {
        align: 'right'
      }
    )

    this.pdfDocument.moveDown().moveDown()
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addDelyveryTime
   * @param {String} deliveryTime
   */
  addDeliveryTime(deliveryTime) {
    // validate params
    if (typeof deliveryTime !== 'string') {
      throw new TypeError('deliveryTime param must be a string')
    }
    this.addText(`Tiempo de entrega: ${deliveryTime}`)
    this.pdfDocument.moveDown()
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addConditions
   * @param {Object} conditions
   * @param {Array} titleConditions
   */
  addConditions(conditions, titleConditions) {
    // validate params
    if (typeof conditions !== 'object') {
      throw new TypeError('conditions must be an Array')
    }
    if (titleConditions && typeof titleConditions !== 'string') {
      throw new TypeError('titleConditions param must be a string')
    }

    this.pdfDocument.moveDown()
    // Render conditions
    this.addNote(titleConditions || 'CONDICIONES DE VENTA:')
    this.pdfDocument.moveDown()
    for (let i = 0; i < conditions.length; i++) {
      this.addNote(`${conditions[i]}`)
    }
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * addSignature
   * @param {Object} pdfDocument
   * @param {String} name
   */
  addSignature(name) {
    this.pdfDocument
      .moveDown()
      .moveDown()
      .moveDown()
      .text('ATTE.', { align: 'center' })
    this.pdfDocument.moveDown().text(name, { align: 'center' })
  }
}
export default PdfService
