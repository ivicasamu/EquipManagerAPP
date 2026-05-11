export const IME_APLIKACIJE='Equip Manager APP'

export const RouteNames = {
    HOME: '/',
    NADZORNA_PLOCA: '/nadzorna-ploca',
    
    KORISNICI: '/korisnici',
    KORISNICI_NOVI: '/korisnici/novi',
    KORISNICI_PROMJENA: '/korisnici/:sifra',
    KORISNICI_PROMJENA_LOZINKE: '/korisnici/:sifra/lozinka',

    KATEGORIJE: '/kategorije',
    KATEGORIJE_NOVI: '/kategorije/novi',
    KATEGORIJE_PROMJENA: '/kategorije/:sifra',

    STATUSI: '/statusi',
    STATUSI_NOVI: '/statusi/novi',
    STATUSI_PROMJENA: '/statusi/:sifra',

    UREDJAJI: '/uredjaji',
    UREDJAJI_NOVI: '/uredjaji/novi',
    UREDJAJI_PROMJENA: '/uredjaji/:sifra',

    KLIJENTI: '/klijenti',
    KLIJENTI_NOVI: '/klijenti/novi',
    KLIJENTI_PROMJENA: '/klijenti/:sifra',

    EVENTI: '/eventi',
    EVENTI_NOVI: '/eventi/novi',
    EVENTI_PROMJENA: '/eventi/:sifra',

    GENERIRANJE_PODATAKA: '/generiraj-podatke',

    LOGIN: '/login',
    REGISTRACIJA: '/registracija',

}

// memorija, localStorage, firebase
export const DATA_SOURCE = 'memorija'

export const PrefixStorage = {
   KORISNICI: 'korisnici',
   KATEGORIJE: 'kategorije',
   STATUSI: 'statusi',
   UREDJAJI: 'uredjaji',
   KLIJENTI: 'klijenti',
   EVENTI: 'eventi'

}