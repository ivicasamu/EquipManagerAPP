import bcrypt from 'bcryptjs'

// Inicijalni operateri s hashiranim lozinkama
// Lozinka za sve: "Test123.!"
const hashiranaLozinka = bcrypt.hashSync('Test123.', 10)

export const korisnici = [
    { sifra: 1, ime: 'Ivica', prezime: 'Šamu', korisnickoIme: 'isamu', lozinka: hashiranaLozinka, email: 'ivica.samu@gmail.com', administrator: true },
    { sifra: 2, ime: 'Test', prezime: 'Admin', korisnickoIme: 'admin', lozinka: hashiranaLozinka, email: 'pero.peric@gmail.com', administrator: true },
    { sifra: 3, ime: 'Test', prezime: 'User', korisnickoIme: 'user', lozinka: hashiranaLozinka, email: 'ana.anic@gmail.com', administrator: false }
]

export default{
    korisnici
}