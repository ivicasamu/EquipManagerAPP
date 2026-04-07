import { kategorije } from "./KategorijaPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...kategorije]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: kategorije.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(kategorija){
    if(kategorije.length===0){
        kategorija.sifra=1
    }else{
        kategorija.sifra = kategorije[kategorije.length - 1].sifra + 1
    }
    
    kategorije.push(kategorija)
}

// 3/4 Update od CRUD
async function promjeni(sifra,kategorija) {
    const index = nadiIndex(sifra)
    kategorije[index] = {...kategorije[index], ...kategorija}
}

function nadiIndex(sifra){
    return kategorije.findIndex(s=>s.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        kategorije.splice(index, 1);
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