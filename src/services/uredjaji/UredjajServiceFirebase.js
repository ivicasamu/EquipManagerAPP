import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc
} from "firebase/firestore"

import StatusService from "../statusi/StatusService"
import KategorijaService from "../kategorije/KategorijaService"

import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"


function dohvatiNazivStatusa(sifra, statusi) {

    const s = statusi.find(
        x => x.sifra === sifra
    )

    return s ? s.naziv : ''
}


// 1/4 Read - dohvati sve
async function get() {

    try {

        const skupUredjaja = collection(
            getFirebaseDB(),
            PrefixStorage.UREDJAJI
        )

        const snapshot = await getDocs(
            skupUredjaja
        )

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
            "Greška kod dohvaćanja uređaja:",
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
            PrefixStorage.UREDJAJI,
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
                message: "Uređaj ne postoji"
            }

        }

    } catch (e) {

        console.error(
            "Greška kod dohvaćanja uređaja:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 2/4 Create - dodaj novi
async function dodaj(uredjaj) {

    try {

        const skupUredjaja = collection(
            getFirebaseDB(),
            PrefixStorage.UREDJAJI
        )

        const docRef = await addDoc(
            skupUredjaja,
            uredjaj
        )

        return {
            success: true,
            data: {
                sifra: docRef.id
            }
        }

    } catch (e) {

        console.error(
            "Greška kod dodavanja uređaja:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// 3/4 Update - promjeni postojeći
async function promjeni(sifra, uredjaj) {

    try {

        const docRef = doc(
            getFirebaseDB(),
            PrefixStorage.UREDJAJI,
            sifra
        )

        await updateDoc(docRef, uredjaj)

        return {
            success: true
        }

    } catch (e) {

        console.error(
            "Greška kod promjene uređaja:",
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
            PrefixStorage.UREDJAJI,
            sifra
        )

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Obrisano"
        }

    } catch (e) {

        console.error(
            "Greška kod brisanja uređaja:",
            e
        )

        return {
            success: false,
            message: e.message
        }
    }
}


// Straničenje
async function getPage(
    page = 1,
    pageSize = 10,
    searchTerm = '',
    sortBy = 'model',
    sortDir = 'asc'
) {

    try {

        let uredjaji = (await get()).data || []

        const statusi =
            (await StatusService.get()).data

        const statusMap = {}

        statusi.forEach(s => {

            statusMap[s.sifra] =
                (s.naziv || '').toLowerCase()

        })


        const kategorije =
            (await KategorijaService.get()).data

        const kategorijaMap = {}

        kategorije.forEach(s => {

            kategorijaMap[s.sifra] =
                (s.naziv || '').toLowerCase()

        })


        // filtriranje
        if (
            searchTerm &&
            searchTerm.trim() !== ''
        ) {

            const search = searchTerm
                .toLowerCase()
                .trim()

            uredjaji = uredjaji.filter(
                uredjaj => {

                    const model =
                        (uredjaj.model || '')
                            .toLowerCase()

                    const serijskiBroj =
                        (uredjaj.serijskiBroj || '')
                            .toLowerCase()

                    const statusNaziv =
                        statusMap[uredjaj.status]
                        || ''

                    const kategorijaNaziv =
                        kategorijaMap[
                            uredjaj.kategorija
                        ] || ''

                    return (
                        model.includes(search) ||
                        serijskiBroj.includes(search) ||
                        statusNaziv.includes(search) ||
                        kategorijaNaziv.includes(search)
                    )
                }
            )
        }


        // sortiranje
        uredjaji.sort((a, b) => {

            let vrijednostA = ''
            let vrijednostB = ''

            if (sortBy === 'model') {

                vrijednostA =
                    (a.model || '')
                        .toLowerCase()

                vrijednostB =
                    (b.model || '')
                        .toLowerCase()
            }

            else if (sortBy === 'status') {

                vrijednostA =
                    statusMap[a.status] || ''

                vrijednostB =
                    statusMap[b.status] || ''
            }

            else if (
                sortBy === 'kategorija'
            ) {

                vrijednostA =
                    kategorijaMap[
                        a.kategorija
                    ] || ''

                vrijednostB =
                    kategorijaMap[
                        b.kategorija
                    ] || ''
            }

            else if (sortBy === 'sifra') {

                vrijednostA = a.sifra || 0
                vrijednostB = b.sifra || 0

                return sortDir === 'asc'
                    ? vrijednostA.localeCompare(
                        vrijednostB
                    )
                    : vrijednostB.localeCompare(
                        vrijednostA
                    )
            }

            const rezultat =
                vrijednostA.localeCompare(
                    vrijednostB
                )

            return sortDir === 'asc'
                ? rezultat
                : -rezultat
        })


        const startIndex =
            (page - 1) * pageSize

        const endIndex =
            startIndex + pageSize

        return {
            success: true,
            data: uredjaji.slice(
                startIndex,
                endIndex
            ),
            currentPage: page,
            pageSize: pageSize,
            totalPages: Math.ceil(
                uredjaji.length / pageSize
            ),
            totalItems: uredjaji.length
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