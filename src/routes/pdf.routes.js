import express from 'express'
import PDFDocument from 'pdfkit-table'
import PdfService from '../services/PdfService.js'
const router = express.Router()

router.post('/generatePdf', async (req, res) => {
  const data = req.body

  // Start new document
  const doc = new PDFDocument()

  // Create pdfManager
  const pdfManager = new PdfService(doc)

  // build basic structure
  pdfManager.addHeader()
  pdfManager.addIntroduction(data.header)
  await pdfManager.addAmounts(data.products)
  pdfManager.addDeliveryTime(data.deliveryTime)
  pdfManager.addConditions(data.conditions)
  pdfManager.addSignature(data.signature)

  // config output
  doc.pipe(res)
  res.writeHead(200, {
    'Content-Type': 'application/pdf'
  })

  // close document
  doc.end()
})

export default router
