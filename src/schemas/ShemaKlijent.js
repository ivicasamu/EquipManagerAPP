import { z } from 'zod'

export const ShemaKlijent = z.object({
    naziv: z.string()
        .trim()
        .min(1, "Naziv je obavezno i ne smije sadržavati samo razmake!")
        .min(2, "Naziv mora imati najmanje 2 znaka!")
        .max(20, "Naziv može imati najviše 20 znakova!"),

    adresa: z.string()
        .trim()
        .min(1, "Adresa je obavezno i ne smije sadržavati samo razmake!")
        .min(2, "Adresa mora imati najmanje 2 znaka!")
        .max(100, "Adresa može imati najviše 100 znakova!"),
    
    kontaktOsoba: z.string()
        .trim()
        .min(1, "Kontakt osoba je obavezno i ne smije sadržavati samo razmake!")
        .min(2, "Kontakt osoba mora imati najmanje 2 znaka!")
        .max(20, "Kontakt osoba može imati najviše 20 znakova!"),   
    
    email: z.email({ message: "Email nije u ispravnom formatu!" })
        .transform(val => val.trim()),
    
    oib: z.string()
        .trim()
        .length(11, "OIB mora imati točno 11 znamenki!")
        .regex(/^\d+$/, "OIB smije sadržavati samo brojeve!")
        .refine((val) => isValidOIB(val), {
        message: "OIB nije formalno ispravan!",
    })
});
// https://github.com/domagojpa/oib-validation
const isValidOIB = (oib) => {
  if (oib.length !== 11 || isNaN(oib)) return false;

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = a + parseInt(oib[i], 10);
    a = a % 10;
    if (a === 0) a = 10;
    a *= 2;
    a = a % 11;
  }

  let kontrolna = 11 - a;
  if (kontrolna === 10) kontrolna = 0;

  return kontrolna === parseInt(oib[10], 10);
};
