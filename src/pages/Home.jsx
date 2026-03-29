import { IME_APLIKACIJE } from "../constants"
import slika from '../assets/slika.svg'
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function Home(){
    return(
        <>
        <h1>Dobro došli na {IME_APLIKACIJE}</h1>

        <div style={{maxWidth: '800px', margin: 'auto', padding: '100px'}}>
            <DotLottieReact
                src="/Animacija.lottie" loop autoplay
            />
        </div>
        </>
    )
}