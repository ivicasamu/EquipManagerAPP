import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

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
        .min(8, "Lozinka mora imati najmanje 6 znaka!")
        .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!")
        .optional(),

    email: z.string()
        .trim()
        .min(1, "Email je obavezan!")
        .email("Unesite ispravan email format!"),
    
});

// Shema za login (samo email i lozinka)
export const ShemaLogin = z.object({
  korisnickoIme: z.string()
        .trim()
        .min(1, "Korisnicko ime je obavezno i ne smije sadržavati samo razmake!")
        .min(4, "Korisnicko ime mora imati najmanje 4 znaka!")
        .max(20, "Korisnicko ime može imati najviše 20 znakova!"),
  
  lozinka: z.string()
        .min(8, "Lozinka mora imati najmanje 8 znakova!")
        .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!")
});

// Shema za promjenu lozinke (zahtijeva potvrdu)
export const ShemaPromjenaLozinke = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpukcijski znak!"),
  
  potvrdaLozinke: z.string()
    .min(1, "Potvrda lozinke je obavezna!")
}).refine((data) => data.novaLozinka === data.potvrdaLozinke, {
  message: "Lozinke se ne podudaraju!",
  path: ["potvrdaLozinke"]
});