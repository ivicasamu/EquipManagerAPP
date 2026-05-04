import { z } from 'zod'

export const ShemaKorisnik = z.object({
    ime: z.string()
        .trim()
        .min(1, "Ime je obavezno i ne smije sadržavati samo razmake!")
        .min(2, "Ime mora imati najmanje 2 znaka!")
        .max(20, "Ime može imati najviše 20 znakova!"),
    
    prezime: z.string()
        .trim()
        .min(1, "Prezime je obavezno i ne smije sadržavati samo razmake!")
        .min(2, "Prezime mora imati najmanje 2 znaka!")
        .max(20, "Prezime može imati najviše 20 znakova!"),

    korisnickoIme: z.string()
        .trim()
        .min(1, "Korisnicko ime je obavezno i ne smije sadržavati samo razmake!")
        .min(4, "Korisnicko ime mora imati najmanje 4 znaka!")
        .max(20, "Korisnicko ime može imati najviše 20 znakova!")
        .optional(),
    
    lozinka: z.string()
        .trim()
        .min(1, "Lozinka je obavezna i ne smije sadržavati samo razmake!")
        .min(6, "Lozinka mora imati najmanje 6 znaka!")
        .max(10, "Lozinka može imati najviše 10 znakova!")
        .optional(),
    
    email: z.email({ message: "Email nije u ispravnom formatu!" })
        .transform(val => val.trim()),
    
});

