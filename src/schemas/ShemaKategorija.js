import { z } from 'zod'

export const ShemaKategorija = z.object({
  naziv: z.string({
    required_error: "Ime je obavezno"
  })
    .min(1, 'Naziv je obavezan')
    .min(3, 'Naziv mora imati barem 3 znaka')
    .max(50, 'Naziv može imati najviše 50 znakova')
})