const STORAGE_KEY = 'status';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const statusi = dohvatiSveIzStorage();
    return {success: true,  data: [...statusi] };
}

async function getBySifra(sifra) {
    const statusi = dohvatiSveIzStorage();
    const status = statusi.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: status };
}

async function dodaj(status) {
    const statusi = dohvatiSveIzStorage();
    
    if (statusi.length === 0) {
        status.sifra = 1;
    } else {
        const maxSifra = Math.max(...statusi.map(s => s.sifra));
        status.sifra = maxSifra + 1;
    }
    
    statusi.push(status);
    spremiUStorage(statusi);
    return { data: status };
}

async function promjeni(sifra, status) {
    const statusi = dohvatiSveIzStorage();
    const index = statusi.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        statusi[index] = { ...statusi[index], ...status};
        spremiUStorage(statusi);
    }
    return { data: statusi[index] };
}

async function obrisi(sifra) {
    let statusi = dohvatiSveIzStorage();
    statusi = statusi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(statusi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
