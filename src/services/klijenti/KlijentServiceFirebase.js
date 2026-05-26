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

        const skupKlijenata = collection(
            getFirebaseDB(),
            PrefixStorage.KLIJENTI
        )

        const snapshot = await getDocs(skupKlijenata)

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
            "Greška kod dohvaćanja klijenata:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Dohvati jednog po šifri
async function getBySifra(sifra) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KLIJENTI,
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
                message: "Klijent ne postoji"
            }

        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja klijenta:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novog
async function dodaj(klijent) {

    try {

        const skupKlijenata = collection(
            getFirebaseDB(),
            PrefixStorage.KLIJENTI
        )

        const docRef = await addDoc(
            skupKlijenata,
            klijent
        )

        return {
            success: true,
            data: {
                sifra: docRef.id
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dodavanja klijenta:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 3/4 Update - promjeni postojećeg
async function promjeni(sifra, klijent) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.KLIJENTI,
            sifra
        )

        await updateDoc(docRef, klijent)

        return {
            success: true
        }

    } catch (e) {

        console.error(
            "Greška kod promjene klijenta:",
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
            PrefixStorage.KLIJENTI,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error(
            "Greška kod brisanja klijenta:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Straničenje
async function getPage(page = 1, pageSize = 10) {

    try {

        const klijenti = (await get()).data || []

        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize

        const paginatedData = klijenti.slice(
            startIndex,
            endIndex
        )

        const totalItems = klijenti.length

        const totalPages = Math.ceil(
            totalItems / pageSize
        )

        return {
            success: true,
            data: paginatedData,
            currentPage: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalItems: totalItems
        }

    } catch (e) {

        console.error(
            "Greška kod pagination:",
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
    obrisi,
    getPage
}