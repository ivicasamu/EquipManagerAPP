import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    where,
    DocumentReference
} from "firebase/firestore"

import bcrypt from "bcryptjs"

import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"


// 1/4 Read - dohvati sve
async function get() {

    try {

        const skupKorisnika = collection(
            getFirebaseDB(),
            PrefixStorage.KORISNICI
        )

        const snapshot = await getDocs(skupKorisnika)

        const data = snapshot.docs.map(docItem => {

            const korisnik = docItem.data()

            return {
                sifra: docItem.id,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                email: korisnik.email,
                korisnickoIme: korisnik.korisnickoIme,
                administrator: korisnik.administrator
            }

        })

        return {
            success: true,
            data
        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja korisnika:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Dohvati po šifri
async function getBySifra(sifra) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KORISNICI,
            sifra
        )

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {

            return {
                success: false,
                data: null
            }
        }

        const korisnik = docSnap.data()

        return {
            success: true,
            data: {
                sifra: docSnap.id,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                email: korisnik.email,
                korisnickoIme: korisnik.korisnickoIme,
                administrator: korisnik.administrator
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja korisnika:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novog
async function dodaj(korisnik) {

    try {

        // hash lozinke
        korisnik.lozinka = bcrypt.hashSync(
            korisnik.lozinka,
            10
        )

        const skupKorisnika = collection(
            getFirebaseDB(),
            PrefixStorage.KORISNICI
        )

        const docRef = await addDoc(
            skupKorisnika,
            korisnik
        )

        return {
            success: true,
            data: {
                sifra: docRef.id,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                email: korisnik.email,
                administrator: korisnik.administrator
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dodavanja korisnika:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}

async function dodajBezHash(korisnik) {
    try {
        const noviKorisnik = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            email: korisnik.email,
            korisnickoIme: korisnik.korisnickoIme,
            administrator: korisnik.administrator
        };
        const skupKorisnika = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const docRef = await addDoc(skupKorisnika, noviKorisnik);
        return {
            success: true,
            data: { sifra: docRef.id, korisnickoIme: korisnik.korisnickoIme }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}


// 3/4 Update - promjeni postojećeg
async function promjeni(sifra, korisnik) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KORISNICI,
            sifra
        )

        // ne diramo lozinku
        const podaciZaUpdate = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            email: korisnik.email,
            administrator: korisnik.administrator
        }

        await updateDoc(docRef, podaciZaUpdate)

        return {
            success: true,
            data: podaciZaUpdate
        }

    } catch (e) {

        console.error(
            "Greška kod promjene korisnika:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Promjena lozinke
async function promjeniLozinku(
    sifra,
    novaLozinka
) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KORISNICI,
            sifra
        )

        const hashiranaLozinka = bcrypt.hashSync(
            novaLozinka,
            10
        )

        await updateDoc(docRef, {
            lozinka: hashiranaLozinka
        })

        return {
            success: true,
            message: "Lozinka uspješno promijenjena"
        }

    } catch (e) {

        console.error(
            "Greška kod promjene lozinke:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Prijava
async function prijava(
    korisnickoIme,
    lozinka
) {

    try {

        const skupKorisnika = collection(
            getFirebaseDB(),
            PrefixStorage.KORISNICI
        )

        const q = query(
            skupKorisnika,
            where(
                "korisnickoIme",
                "==",
                korisnickoIme
            )
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) {

            return {
                success: false,
                message: "Email i lozinka ne odgovaraju"
            }
        }

        const docItem = snapshot.docs[0]

        const korisnik = docItem.data()

        const isMatch = bcrypt.compareSync(
            lozinka,
            korisnik.lozinka
        )

        if (!isMatch) {

            return {
                success: false,
                message: "Email i lozinka ne odgovaraju"
            }
        }

        return {
            success: true,
            data: {
                sifra: docItem.id,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                email: korisnik.email,
                korisnickoIme:
                    korisnik.korisnickoIme,
                administrator:
                    korisnik.administrator
            }
        }

    } catch (e) {

        console.error(
            "Greška kod prijave:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 4/4 Delete - obriši
async function obrisi(sifra) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KORISNICI,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error(
            "Greška kod brisanja korisnika:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava,
    dodajBezHash
}