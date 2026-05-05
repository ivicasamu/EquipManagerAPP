import { IME_APLIKACIJE } from "../constants"
import slika from '../assets/slika.svg'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Col, Row, Card } from "react-bootstrap"
import { useState, useEffect } from "react"
import KorisnikService from "../services/korisnici/KorisnikService"
import UredjajService from "../services/uredjaji/UredjajService"
import KlijentService from "../services/klijenti/KlijentService"
import EventService from "../services/eventi/EventService"

export default function NadzornaPloca() {
    

    return (
        <>
        Logirani ste, ovo je nadzorna ploča
        </>
    )
}
