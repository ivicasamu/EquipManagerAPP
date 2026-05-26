import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc
} from "firebase/firestore"

import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"


// 1/4 Read - dohvati sve
async function get() {

    try {

        const skupKategorija = collection(
            getFirebaseDB(),
            PrefixStorage.KATEGORIJE
        )

        const snapshot = await getDocs(skupKategorija)

        const data = snapshot.docs.map(docItem => {

            return {
                sifra: docItem.id,
                ...docItem.data()
            }

        })

        return {
            success: true,
            data: data
        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja kategorija:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Dohvati jednu po šifri
async function getBySifra(sifra) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KATEGORIJE,
            sifra
        )

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {

            return {
                success: true,
                data: {
                    sifra: docSnap.id,
                    ...docSnap.data()
                }
            }

        } else {

            return {
                success: false,
                message: "Kategorija ne postoji"
            }

        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja kategorije:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novu
async function dodaj(kategorija) {

    try {

        const skupKategorija = collection(
            getFirebaseDB(),
            PrefixStorage.KATEGORIJE
        )

        const docRef = await addDoc(
            skupKategorija,
            kategorija
        )

        return {
            success: true,
            data: {
                sifra: docRef.id
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dodavanja kategorije:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 3/4 Update - promjeni postojeću
async function promjeni(sifra, kategorija) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KATEGORIJE,
            sifra
        )

        await updateDoc(docRef, kategorija)

        return {
            success: true
        }

    } catch (e) {

        console.error(
            "Greška kod promjene kategorije:",
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
            PrefixStorage.KATEGORIJE,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error(
            "Greška kod brisanja kategorije:",
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
    obrisi
}