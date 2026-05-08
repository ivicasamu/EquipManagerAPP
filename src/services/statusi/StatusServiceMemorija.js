import { statusi } from "./StatusPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...statusi]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: statusi.find(s => s.sifra === sifra)}
}

// 2/4 Create od CRUD
async function dodaj(status){
    if(statusi.length===0){
        status.sifra = '1'
    }else{
        status.sifra = String(parseInt(statusi[statusi.length - 1].sifra) + 1)
    }
    
    statusi.push(status)
}

// 3/4 Update od CRUD
async function promjeni(sifra,status) {
    const index = nadiIndex(sifra)
    statusi[index] = {...statusi[index], ...status}
}

function nadiIndex(sifra){
    return statusi.findIndex(s=>s.sifra === sifra)
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        statusi.splice(index, 1);
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