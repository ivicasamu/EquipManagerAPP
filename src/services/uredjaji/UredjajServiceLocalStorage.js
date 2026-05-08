import StatusService from "../statusi/StatusService"
import KategorijaService from "../kategorije/KategorijaService"
import { PrefixStorage } from "../../constants"

function dohvatiNazivStatusa(sifra, statusi) {
    const s = statusi.find(x => x.sifra === sifra)
    return s ? s.naziv : ''
}

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.UREDJAJI)
    return podaci ? JSON.parse(podaci) : []
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.UREDJAJI, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const uredjaji = dohvatiSveIzStorage()
    return {success: true,  data: [...uredjaji] }
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const uredjaji = dohvatiSveIzStorage()
    const uredjaj = uredjaji.find(g => g.sifra === sifra)
    return {success: true,  data: uredjaj }
}

// 2/4 Create - dodaj novi
async function dodaj(uredjaj) {
    const uredjaji = dohvatiSveIzStorage()

    if(uredjaji.length === 0){
        uredjaj.sifra = '1'
    } else {
        uredjaj.sifra = String(parseInt(uredjaji[uredjaji.length - 1].sifra) + 1)
    }

    uredjaji.push(uredjaj)
    spremiUStorage(uredjaji)

    return { data: uredjaj }
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, uredjaj) {
    const uredjaji = dohvatiSveIzStorage()
    const index = uredjaji.findIndex(g => g.sifra === sifra)
    
    if (index !== -1) {
        uredjaji[index] = { ...uredjaji[index], ...uredjaj, sifra: sifra }
        spremiUStorage(uredjaji)
    }
    return { data: uredjaji[index] }
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let uredjaji = dohvatiSveIzStorage()
    uredjaji = uredjaji.filter(g => g.sifra !== sifra)
    spremiUStorage(uredjaji)
    return { message: 'Obrisano' }
}

// Straničenje - dohvati stranicu polaznika
async function getPage(
    page = 1, 
    pageSize = 10, 
    searchTerm = '', 
    sortBy = 'model', 
    sortDir = 'asc'
) {
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

            const statusNaziv = statusMap[uredjaj.status] || ''
            const kategorijaNaziv = kategorijaMap[uredjaj.kategorija] || ''

            return (
                model.includes(search) ||
                serijskiBroj.includes(search) ||
                statusNaziv.includes(search) ||
                kategorijaNaziv.includes(search)
            )
        })
    }

    // Ovdje bi trebalo doći sortiranje, moraš primiti još jedan objekt ili dva parametra.
    // Pogledaj https://github.com/BornaNovak/AeroMusicay/blob/main/src/services/albumi/AlbumServiceLocalStorage.js

    // SORTIRANJE
    uredjaji.sort((a, b) => {
        let vrijednostA = ''
        let vrijednostB = ''

        if (sortBy === 'model') {
            vrijednostA = (a.model || '').toLowerCase()
            vrijednostB = (b.model || '').toLowerCase()
        } 
        else if (sortBy === 'status') {
            vrijednostA = statusMap[a.status] || ''
            vrijednostB = statusMap[b.status] || ''
        } 
        else if (sortBy === 'kategorija') {
            vrijednostA = kategorijaMap[a.kategorija] || ''
            vrijednostB = kategorijaMap[b.kategorija] || ''
        }

        else if (sortBy === 'sifra') {
            vrijednostA = a.sifra || 0
            vrijednostB = b.sifra || 0

            return sortDir === 'asc' 
                ? vrijednostA - vrijednostB 
                : vrijednostB - vrijednostA
        }

        const rezultat = vrijednostA.localeCompare(vrijednostB)

        return sortDir === 'asc' ? rezultat : -rezultat
    })

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
