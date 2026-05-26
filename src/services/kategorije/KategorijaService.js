import { DATA_SOURCE } from "../../constants";
import KategorijaServiceMemorija from "./KategorijaServiceMemorija";
import KategorijaServiceLocalStorage from "./KategorijaServiceLocalStorage";
import KategorijaServiceFirebase from "./KategorijaServiceFirebase";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = KategorijaServiceMemorija;
        break;
    case 'localStorage':
        Servis = KategorijaServiceLocalStorage;
        break;
    case 'firebase':
        Servis = KategorijaServiceFirebase;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (kategorija) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, kategorija) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (kategorija) => AktivniServis.dodaj(kategorija),
    promjeni: (sifra, kategorija) => AktivniServis.promjeni(sifra, kategorija),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};