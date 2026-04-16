const STORAGE_KEY = 'eventi';

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const eventi = dohvatiSveIzStorage();
    return {success: true,  data: [...eventi] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const eventi = dohvatiSveIzStorage();
    const event = eventi.find(g => g.sifra === parseInt(sifra));
    return {success: true,  data: event };
}

// 2/4 Create - dodaj novi
async function dodaj(event) {
    const eventi = dohvatiSveIzStorage();

    const maxSifra = Math.max(0, ...eventi.map(g => g.sifra || 0));
    event.sifra = maxSifra + 1;

    eventi.push(event);
    spremiUStorage(eventi);

    return { data: event };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, event) {
    const eventi = dohvatiSveIzStorage();
    const index = eventi.findIndex(g => g.sifra === parseInt(sifra));
    
    if (index !== -1) {
        eventi[index] = { ...eventi[index], ...event, sifra: parseInt(sifra) };
        spremiUStorage(eventi);
    }
    return { data: eventi[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let eventi = dohvatiSveIzStorage();
    eventi = eventi.filter(g => g.sifra !== parseInt(sifra));
    spremiUStorage(eventi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
