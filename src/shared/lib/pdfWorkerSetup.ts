import { pdfjs } from 'react-pdf'
// @ts-ignore — pdf.worker.entry не имеет типизации по умолчанию
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.entry'

// Устанавливаем воркер
pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
  new Blob(
    [`importScripts("${(pdfWorker as any).default || pdfWorker}")`],
    { type: 'application/javascript' }
  )
)
