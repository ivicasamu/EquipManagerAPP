import { korisnici } from "./KorisniciPodaci"


async function get() {
    return {data: korisnici}
}

export default{
    get
}