import bcrypt from 'bcryptjs'

// Inicijalni operateri s hashiranim lozinkama
// Lozinka za sve: "Test123.!"
const hashiranaLozinka = bcrypt.hashSync('Test123.', 10)

export const korisnici = [
    { sifra: 1, ime: 'Ivica', prezime: 'Šamu', korisnickoIme: 'isamu', lozinka: hashiranaLozinka, email: 'ivica.samu@gmail.com', administrator: true },
    { sifra: 2, ime: 'Pero', prezime: 'Perić', korisnickoIme: 'pperic', lozinka: hashiranaLozinka, email: 'pero.peric@gmail.com', administrator: false },
    { sifra: 3, ime: 'Ana', prezime: 'Anić', korisnickoIme: 'aanic', lozinka: hashiranaLozinka, email: 'ana.anic@gmail.com', administrator: false },
    { sifra: 4, ime: 'Marko', prezime: 'Marić', korisnickoIme: 'mmaric', lozinka: hashiranaLozinka, email: 'marko.maric@gmail.com', administrator: false },
    { sifra: 5, ime: 'Ivana', prezime: 'Ivić', korisnickoIme: 'iivic', lozinka: hashiranaLozinka, email: 'ivana.ivic@gmail.com', administrator: false }
]

export default{
    korisnici
}