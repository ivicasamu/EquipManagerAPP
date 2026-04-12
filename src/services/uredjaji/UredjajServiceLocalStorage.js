const STORAGE_KEY = 'uredjaji';

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
    const uredjaji = dohvatiSveIzStorage();
    return {success: true,  data: [...uredjaji] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const uredjaji = dohvatiSveIzStorage();
    const uredjaj = uredjaji.find(g => g.sifra === parseInt(sifra));
    return {success: true,  data: uredjaj };
}

// 2/4 Create - dodaj novi
async function dodaj(uredjaj) {
    const uredjaji = dohvatiSveIzStorage();
    
    if (uredjaji.length === 0) {
        uredjaji.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...uredjaji.map(g => g.sifra));
        uredjaj.sifra = maxSifra + 1;
    }
    
    uredjaji.push(uredjaj);
    spremiUStorage(uredjaji);
    return { data: uredjaj };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, uredjaj) {
    const uredjaji = dohvatiSveIzStorage();
    const index = uredjaji.findIndex(g => g.sifra === parseInt(sifra));
    
    if (index !== -1) {
        uredjaji[index] = { ...uredjaji[index], ...uredjaj, sifra: parseInt(sifra) };
        spremiUStorage(uredjaji);
    }
    return { data: uredjaji[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let uredjaji = dohvatiSveIzStorage();
    uredjaji = uredjaji.filter(g => g.sifra !== parseInt(sifra));
    spremiUStorage(uredjaji);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
