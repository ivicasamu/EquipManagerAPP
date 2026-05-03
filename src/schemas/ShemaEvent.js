import { z } from 'zod'

export const ShemaEvent = z.object({
    datumPocetka: z.coerce.date({
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_date) {
        return { message: "Molimo unesite ispravan format datuma!" };
      }
      return { message: ctx.defaultError };
    },
    invalid_type_error: "Molimo unesite ispravan format datuma!",
    required_error: "Datum je obavezan!"
  }),

    lokacija: z.string()
        .trim()
        .min(1, "Lokacija je obavezna i ne smije sadržavati samo razmake!")
        .min(3, "Lokacija mora imati najmanje 3 znaka!")
        .max(50, "Lokacija može imati najviše 50 znakova!"),
    
    klijent: z.coerce.number()
        .positive('Obavezan odabir klijenta')
        
});