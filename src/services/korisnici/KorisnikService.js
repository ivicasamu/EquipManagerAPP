import KorisnikServiceLocalStorage from "./KorisnikServiceLocalStorage";
import KorisnikServiceMemorija from "./KorisnikServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = KorisnikServiceMemorija;
        break;
    case 'localStorage':
        Servis = KorisnikServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (smjer) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, smjer) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (smjer) => AktivniServis.dodaj(smjer),
    promjeni: (sifra, smjer) => AktivniServis.promjeni(sifra, smjer),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};