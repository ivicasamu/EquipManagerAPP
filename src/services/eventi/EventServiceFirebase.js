import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore"

import getFirebaseDB from "../Firebase"
import KlijentService from "../klijenti/KlijentService"
import { PrefixStorage } from "../../constants"


// 1/4 Read - dohvati sve
async function get() {
    try {
        const skupEventa = collection(getFirebaseDB(), PrefixStorage.EVENTI)
        const snapshot = await getDocs(skupEventa)

        const data = snapshot.docs.map(docItem => {
            const podaci = docItem.data()

            const d = podaci.datumPocetka
                ? podaci.datumPocetka.toDate()
                : new Date()

            return {
                sifra: docItem.id,
                ...podaci,
                datumPocetka: d.toISOString()
            }
        })

        return {
            success: true,
            data: data
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja eventa:", e)

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
            PrefixStorage.EVENTI,
            sifra
        )

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {

            const podaci = docSnap.data()

            const d = podaci.datumPocetka
                ? podaci.datumPocetka.toDate()
                : new Date()

            return {
                success: true,
                data: {
                    sifra: docSnap.id,
                    ...podaci,
                    datumPocetka: d.toISOString()
                }
            }

        } else {

            return {
                success: false,
                message: "Event ne postoji"
            }

        }

    } catch (e) {

        console.error("Greška kod dohvaćanja eventa:", e)

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novi
async function dodaj(event) {

    try {

        // datum -> Firebase Timestamp
        if (event.datumPocetka) {
            event.datumPocetka = Timestamp.fromDate(
                new Date(event.datumPocetka)
            )
        }

        const skupEventa = collection(
            getFirebaseDB(),
            PrefixStorage.EVENTI
        )

        const docRef = await addDoc(skupEventa, event)

        return {
            success: true,
            data: {
                sifra: docRef.id
            }
        }

    } catch (e) {

        console.error("Greška kod dodavanja eventa:", e)

        return {
            success: false,
            message: e.message
        }
    }
}


// 3/4 Update - promjeni postojeći
async function promjeni(sifra, event) {

    try {

        // datum -> Firebase Timestamp
        if (event.datumPocetka) {
            event.datumPocetka = Timestamp.fromDate(
                new Date(event.datumPocetka)
            )
        }

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.EVENTI,
            sifra
        )

        await updateDoc(docRef, event)

        return {
            success: true
        }

    } catch (e) {

        console.error("Greška kod promjene eventa:", e)

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
            PrefixStorage.EVENTI,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error("Greška kod brisanja eventa:", e)

        return {
            success: false,
            message: e.message
        }
    }
}


function formatirajDatum(datum) {

    if (!datum) return ''

    const d = new Date(datum)

    if (isNaN(d.getTime())) return ''

    return new Intl.DateTimeFormat('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d) + (datum.includes('T') ? '' : '.')
}


// Straničenje
async function getPage(
    page = 1,
    pageSize = 10,
    searchTerm = ''
) {

    try {

        let eventi = (await get()).data || []

        const klijenti = (await KlijentService.get()).data

        const klijentMap = {}

        klijenti.forEach(s => {
            klijentMap[s.sifra] =
                (s.naziv || '').toLowerCase()
        })


        // filtriranje
        if (searchTerm && searchTerm.trim() !== '') {

            const search = searchTerm
                .toLowerCase()
                .trim()
                .replaceAll('.', '')

            eventi = eventi.filter(event => {

                const datum = formatirajDatum(
                    event.datumPocetka
                )
                    .toLowerCase()
                    .replaceAll('.', '')

                const lokacija =
                    (event.lokacija || '').toLowerCase()

                const klijentNaziv =
                    klijentMap[event.klijent] || ''

                return (
                    datum.includes(search) ||
                    lokacija.includes(search) ||
                    klijentNaziv.includes(search)
                )
            })
        }


        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize

        const paginatedData = eventi.slice(
            startIndex,
            endIndex
        )

        const totalItems = eventi.length

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

        console.error("Greška kod pagination:", e)

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