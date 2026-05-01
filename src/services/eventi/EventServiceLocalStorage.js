import KlijentService from "../klijenti/KlijentService"

const STORAGE_KEY = 'eventi'

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
    const eventi = dohvatiSveIzStorage()
    return {success: true,  data: [...eventi] }
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const eventi = dohvatiSveIzStorage()
    const event = eventi.find(g => g.sifra === parseInt(sifra))
    return {success: true,  data: event }
}

// 2/4 Create - dodaj novi
async function dodaj(event) {
    const eventi = dohvatiSveIzStorage()

    const maxSifra = Math.max(0, ...eventi.map(g => g.sifra || 0))
    event.sifra = maxSifra + 1

    eventi.push(event)
    spremiUStorage(eventi)

    return { data: event }
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, event) {
    const eventi = dohvatiSveIzStorage()
    const index = eventi.findIndex(g => g.sifra === parseInt(sifra))
    
    if (index !== -1) {
        eventi[index] = { ...eventi[index], ...event, sifra: parseInt(sifra) }
        spremiUStorage(eventi)
    }
    return { data: eventi[index] }
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let eventi = dohvatiSveIzStorage()
    eventi = eventi.filter(g => g.sifra !== parseInt(sifra))
    spremiUStorage(eventi)
    return { message: 'Obrisano' }
}

function formatirajDatum(datum) {
    if (!datum) return ''

    const d = new Date(datum)
    if (isNaN(d.getTime())) return ''

    return new Intl.DateTimeFormat('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d) + (datum.includes('T') ? '' : '.')
}

// Straničenje - dohvati stranicu polaznika
async function getPage(page = 1, pageSize = 10, searchTerm = '') {
    let eventi = dohvatiSveIzStorage()

    const klijenti = (await KlijentService.get()).data
    const klijentMap = {}
    klijenti.forEach(s => {
        klijentMap[s.sifra] = (s.naziv || '').toLowerCase()
    })

    // Filtriranje prema search termu
    if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase().trim().replaceAll('.', '')

        eventi = eventi.filter(event => {
            const datum = formatirajDatum(event.datumPocetka)
                .toLowerCase()
                .replaceAll('.', '')

            const lokacija = (event.lokacija || '').toLowerCase()
            const klijentNaziv = klijentMap[parseInt(event.klijent)] || ''

            return (
                datum.includes(search) ||
                lokacija.includes(search) ||
                klijentNaziv.includes(search)
            )
        })
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = eventi.slice(startIndex, endIndex)
    const totalItems = eventi.length
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
        success: true,
        data: paginatedData,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
};
