import { korisnici } from "./KorisnikPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...korisnici]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: korisnici.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(korisnik){
    if(korisnici.length===0){
        korisnik.sifra=1
    }else{
        korisnik.sifra = korisnici[korisnici.length - 1].sifra + 1
    }
    
    korisnici.push(korisnik)
}

// 3/4 Update od CRUD
async function promjeni(sifra,korisnik) {
    const index = nadiIndex(sifra)
    korisnici[index] = {...korisnici[index], ...korisnik}
}

function nadiIndex(sifra){
    return korisnici.findIndex(s=>s.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        korisnici.splice(index, 1);
    }
    return;
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}