import UredjajiServiceLocalStorage from "./UredjajServiceLocalStorage";
import UredjajiServiceMemorija from "./UredjajServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;

// 1. Odabir servisa
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = UredjajiServiceMemorija;
        break;
    case 'localStorage':
        Servis = UredjajiServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog (praznog) ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (uredjaj) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, uredjaj) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); },
    getPage: async (page, pageSize, searchTerm) => ({ success: false, data: [], totalPages: 0, totalItems: 0 })
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (uredjaj) => AktivniServis.dodaj(uredjaj),
    promjeni: (sifra, uredjaj) => AktivniServis.promjeni(sifra, uredjaj),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    getPage: (page, pageSize, searchTerm) => AktivniServis.getPage(page, pageSize, searchTerm)
};
