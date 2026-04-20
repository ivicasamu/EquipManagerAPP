import { eventi } from "./EventPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...eventi]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: eventi.find(g => g.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(event){
    if(eventi.length===0){
        event.sifra=1
    }else{
        event.sifra = eventi[eventi.length - 1].sifra + 1
    }
    
    eventi.push(event)
}

// 3/4 Update od CRUD
async function promjeni(sifra,event) {
    const index = nadiIndex(sifra)
    eventi[index] = {...eventi[index], ...event}
}

function nadiIndex(sifra){
    return eventi.findIndex(g=>g.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        eventi.splice(index, 1);
    }
    return;
}

// Straničenje - dohvati stranicu polaznika
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = eventi.slice(startIndex, endIndex);
    const totalItems = eventi.length;
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
