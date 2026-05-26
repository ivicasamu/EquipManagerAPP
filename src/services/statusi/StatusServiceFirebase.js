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

        const skupStatusa = collection(
            getFirebaseDB(),
            PrefixStorage.STATUSI
        )

        const snapshot = await getDocs(skupStatusa)

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
            "Greška kod dohvaćanja statusa:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Dohvati jedan po šifri
async function getBySifra(sifra) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.STATUSI,
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
                message: "Status ne postoji"
            }

        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja statusa:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novi
async function dodaj(status) {

    try {

        const skupStatusa = collection(
            getFirebaseDB(),
            PrefixStorage.STATUSI
        )

        const docRef = await addDoc(
            skupStatusa,
            status
        )

        return {
            success: true,
            data: {
                sifra: docRef.id
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dodavanja statusa:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 3/4 Update - promjeni postojeći
async function promjeni(sifra, status) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.STATUSI,
            sifra
        )

        await updateDoc(docRef, status)

        return {
            success: true
        }

    } catch (e) {

        console.error(
            "Greška kod promjene statusa:",
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
            PrefixStorage.STATUSI,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error(
            "Greška kod brisanja statusa:",
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