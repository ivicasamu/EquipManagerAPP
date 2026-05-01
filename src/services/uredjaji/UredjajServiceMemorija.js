import { uredjaji } from "./UredjajPodaci"
import { statusi } from "../statusi/StatusPodaci"
import { kategorije } from "../kategorije/KategorijaPodaci"


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
    const index = nadiIndex(sifra)
    if (index > -1) {
        uredjaji.splice(index, 1)
    }
    return;
}

function napraviStatusMap() {
    const map = {}
    statusi.forEach(s => {
        map[s.sifra] = (s.naziv || '').toLowerCase()
    })
    return map
}

function napraviKategorijaMap() {
    const map = {}
    kategorije.forEach(k => {
        map[k.sifra] = (k.naziv || '').toLowerCase()
    })
    return map
}

// 📄 Pagination + Search

async function getPage(page = 1, pageSize = 8, searchTerm = '') {
    let filteredUredjaji = [...uredjaji]
    const statusMap = napraviStatusMap()
    const kategorijaMap = napraviKategorijaMap()

    if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase().trim()
        filteredUredjaji = filteredUredjaji.filter(uredjaj => {
            const model = (uredjaj.model || '').toLowerCase()
            const serijskiBroj = (uredjaj.serijskiBroj || '').toLowerCase()
            const statusNaziv =
                statusMap[parseInt(uredjaj.status)] || ''
            const kategorijaNaziv =
                kategorijaMap[parseInt(uredjaj.kategorija)] || ''
            return (
                model.includes(search) ||
                serijskiBroj.includes(search) ||
                statusNaziv.includes(search) ||
                kategorijaNaziv.includes(search)
            )
        })
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return {
        success: true,
        data: filteredUredjaji.slice(startIndex, endIndex),
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredUredjaji.length / pageSize),
        totalItems: filteredUredjaji.length
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
