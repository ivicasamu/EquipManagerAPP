import { uredjaji } from "./UredjajPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...uredjaji]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: uredjaji.find(g => g.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(uredjaj){
    if(uredjaji.length===0){
        uredjaj.sifra=1
    }else{
        uredjaj.sifra = uredjaji[uredjaji.length - 1].sifra + 1
    }
    
    uredjaji.push(uredjaj)
}

// 3/4 Update od CRUD
async function promjeni(sifra,uredjaj) {
    const index = nadiIndex(sifra)
    uredjaji[index] = {...uredjaji[index], ...uredjaj}
}

function nadiIndex(sifra){
    return uredjaji.findIndex(g=>g.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        uredjaji.splice(index, 1);
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
