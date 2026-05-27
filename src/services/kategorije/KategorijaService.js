import { getDataSource } from "../../constants";
import KategorijaServiceMemorija from "./KategorijaServiceMemorija";
import KategorijaServiceLocalStorage from "./KategorijaServiceLocalStorage";
import KategorijaServiceFirebase from "./KategorijaServiceFirebase";

const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async () => ({ success: false, data: {} }),
    dodaj: async () => { console.error("Servis nije učitan"); },
    promjeni: async () => { console.error("Servis nije učitan"); },
    obrisi: async () => { console.error("Servis nije učitan"); }
};

function dohvatiServis() {

    switch (getDataSource()) {

        case 'memorija':
            return KategorijaServiceMemorija;

        case 'localStorage':
            return KategorijaServiceLocalStorage;

        case 'firebase':
            return KategorijaServiceFirebase;

        default:
            return PrazanServis;
    }
}

export default {

    get: () => dohvatiServis().get(),

    getBySifra: (sifra) => 
        dohvatiServis().getBySifra(sifra),

    dodaj: (kategorija) => 
        dohvatiServis().dodaj(kategorija),

    promjeni: (sifra, kategorija) => 
        dohvatiServis().promjeni(sifra, kategorija),

    obrisi: (sifra) => 
        dohvatiServis().obrisi(sifra)
};