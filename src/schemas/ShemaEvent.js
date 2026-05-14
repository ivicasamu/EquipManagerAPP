import { z } from 'zod'

export const ShemaEvent = z.object({
    datumPocetka: z
      .string()
      .min(1, "Datum je obavezan!")
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), {
          message: "Molimo unesite ispravan datum!"
      }),

    lokacija: z.string()
        .trim()
        .min(1, "Lokacija je obavezna i ne smije sadržavati samo razmake!")
        .min(3, "Lokacija mora imati najmanje 3 znaka!")
        .max(50, "Lokacija može imati najviše 50 znakova!"),
    
    klijent: z.coerce.number()
        .positive('Obavezan odabir klijenta')
        
});