import { DATA_SOURCE } from "../../constants";
import StatusServiceMemorija from "./StatusServiceMemorija";
import StatusServiceLocalStorage from "./StatusServiceLocalStorage";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = StatusServiceMemorija;
        break;
    case 'localStorage':
        Servis = StatusServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (status) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, status) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (status) => AktivniServis.dodaj(status),
    promjeni: (sifra, status) => AktivniServis.promjeni(sifra, status),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};