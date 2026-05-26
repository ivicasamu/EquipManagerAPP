import EventServiceLocalStorage from "./EventServiceLocalStorage";
import EventServiceMemorija from "./EventServiceMemorija";
import { DATA_SOURCE } from "../../constants";
import EventServiceFirebase from "./EventServiceFirebase";

let Servis = null;

// 1. Odabir servisa
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = EventServiceMemorija;
        break;
    case 'localStorage':
        Servis = EventServiceLocalStorage;
        break;
    case 'firebase':
        Servis = EventServiceFirebase;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog (praznog) ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (event) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, event) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); },
    getPage: async (page, pageSize, searchTerm) => ({ success: false, data: [], totalPages: 0, totalItems: 0 })
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (event) => AktivniServis.dodaj(event),
    promjeni: (sifra, event) => AktivniServis.promjeni(sifra, event),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    getPage: (page, pageSize, searchTerm) => AktivniServis.getPage(page, pageSize, searchTerm)
};
