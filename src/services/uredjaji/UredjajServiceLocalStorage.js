import StatusService from "../statusi/StatusService"
import KategorijaService from "../kategorije/KategorijaService"

const STORAGE_KEY = 'uredjaji'

function dohvatiNazivStatusa(sifra, statusi) {
    const s = statusi.find(x => x.sifra === sifra)
    return s ? s.naziv : ''
}

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

// 1/4 Read - dohvati sve
async function get() {
    const uredjaji = dohvatiSveIzStorage()
    return {success: true,  data: [...uredjaji] }
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const uredjaji = dohvatiSveIzStorage()
    const uredjaj = uredjaji.find(g => g.sifra === parseInt(sifra))
    return {success: true,  data: uredjaj }
}

// 2/4 Create - dodaj novi
async function dodaj(uredjaj) {
    const uredjaji = dohvatiSveIzStorage()

    const maxSifra = Math.max(0, ...uredjaji.map(g => g.sifra || 0))
    uredjaj.sifra = maxSifra + 1

    uredjaji.push(uredjaj)
    spremiUStorage(uredjaji)

    return { data: uredjaj }
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, uredjaj) {
    const uredjaji = dohvatiSveIzStorage()
    const index = uredjaji.findIndex(g => g.sifra === parseInt(sifra))
    
    if (index !== -1) {
        uredjaji[index] = { ...uredjaji[index], ...uredjaj, sifra: parseInt(sifra) }
        spremiUStorage(uredjaji)
    }
    return { data: uredjaji[index] }
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let uredjaji = dohvatiSveIzStorage()
    uredjaji = uredjaji.filter(g => g.sifra !== parseInt(sifra))
    spremiUStorage(uredjaji)
    return { message: 'Obrisano' }
}

// Straničenje - dohvati stranicu polaznika
async function getPage(page = 1, pageSize = 10, searchTerm = '') {
    let uredjaji = dohvatiSveIzStorage()
    
    const statusi = (await StatusService.get()).data
    const statusMap = {}
    statusi.forEach(s => {
        statusMap[s.sifra] = (s.naziv || '').toLowerCase()
    })

    const kategorije = (await KategorijaService.get()).data
    const kategorijaMap = {}
    kategorije.forEach(s => {
        kategorijaMap[s.sifra] = (s.naziv || '').toLowerCase()
    })

    // Filtriranje
    if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase().trim()

        uredjaji = uredjaji.filter(uredjaj => {
            const model = (uredjaj.model || '').toLowerCase()
            const serijskiBroj = (uredjaj.serijskiBroj || '').toLowerCase()

            const statusNaziv = statusMap[parseInt(uredjaj.status)] || ''
            const kategorijaNaziv = kategorijaMap[parseInt(uredjaj.kategorija)] || ''

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
        data: uredjaji.slice(startIndex, endIndex),
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(uredjaji.length / pageSize),
        totalItems: uredjaji.length
    }
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
};
