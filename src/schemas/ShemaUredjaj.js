import { z } from 'zod'

export const ShemaUredjaj = z.object({
    model: z.string()
        .trim()
        .min(1, "Model je obavezno i ne smije sadržavati samo razmake!")
        .min(3, "Model mora imati najmanje 3 znaka!")
        .max(30, "Model može imati najviše 30 znakova!"),
    
    kategorija: z.coerce.number()
        .positive('Obavezno odabir kategorije'),
    
    status: z.coerce.number()
        .positive('Obavezno odabir statusa')
        
});