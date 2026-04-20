import { klijenti } from "./KlijentPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...klijenti]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: klijenti.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(klijent){
    if(klijenti.length===0){
        klijent.sifra=1
    }else{
        klijent.sifra = klijenti[klijenti.length - 1].sifra + 1
    }
    
    klijenti.push(klijent)
}

// 3/4 Update od CRUD
async function promjeni(sifra,klijent) {
    const index = nadiIndex(sifra)
    klijenti[index] = {...klijenti[index], ...klijent}
}

function nadiIndex(sifra){
    return klijenti.findIndex(s=>s.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        klijenti.splice(index, 1);
    }
    return;
}

// Straničenje - dohvati stranicu polaznika
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = klijenti.slice(startIndex, endIndex);
    const totalItems = klijenti.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
        success: true,
        data: paginatedData,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    }
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
}