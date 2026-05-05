import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container} from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KorisnikPregled from './pages/korisnici/KorisnikPregled'
import KorisnikNovi from './pages/korisnici/KorisnikNovi'
import KorisnikPromjena from './pages/korisnici/KorisnikPromjena'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
import KategorijaPromjena from './pages/kategorije/KategorijaPromjena'
import StatusPregled from './pages/statusi/StatusPregled'
import StatusNovi from './pages/statusi/StatusNovi'
import StatusPromjena from './pages/statusi/StatusPromjena'
import UredjajPregled from './pages/uredjaji/UredjajPregled'
import UredjajNovi from './pages/uredjaji/UredjajNovi'
import UredjajPromjena from './pages/uredjaji/UredjajPromjena'
import KlijentPregled from './pages/klijenti/KlijentPregled'
import KlijentNovi from './pages/klijenti/KlijentNovi'
import KlijentPromjena from './pages/klijenti/KlijentPromjena'
import EventPregled from './pages/eventi/EventPregled'
import EventNovi from './pages/eventi/EventNovi'
import EventPromjena from './pages/eventi/EventPromjena'
import GenerirajPodatke from './pages/GeneriranjePodataka'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import Login from './pages/login/Login'
import Registracija from './pages/registracija/Registracija'
import NadzornaPloca from './pages/NadzornaPloca'
import useAuth from './hooks/useAuth'

function App() {

  const { isLoggedIn, authUser } = useAuth()

  return (
    <>
      <LoadingSpinner />
      <Container style={{ backgroundColor: window.location.hostname === 'localhost' ? '#ffff023c' : 'none' }}>
        <Izbornik />
        <Container className='app'>
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />

            {isLoggedIn ? (
              <>
                <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />

                <Route path={RouteNames.UREDJAJI} element={<UredjajPregled />} />
                <Route path={RouteNames.UREDJAJI_NOVI} element={<UredjajNovi />} />
                <Route path={RouteNames.UREDJAJI_PROMJENA} element={<UredjajPromjena />} />

                <Route path={RouteNames.KLIJENTI} element={<KlijentPregled />} />
                <Route path={RouteNames.KLIJENTI_NOVI} element={<KlijentNovi />} />
                <Route path={RouteNames.KLIJENTI_PROMJENA} element={<KlijentPromjena />} />

                <Route path={RouteNames.EVENTI} element={<EventPregled />} />
                <Route path={RouteNames.EVENTI_NOVI} element={<EventNovi />} />
                <Route path={RouteNames.EVENTI_PROMJENA} element={<EventPromjena />} />

                {authUser.administrator === true && (
                  <>
                    <Route path={RouteNames.KORISNICI} element={<KorisnikPregled />} />
                    <Route path={RouteNames.KORISNICI_NOVI} element={<KorisnikNovi />} />
                    <Route path={RouteNames.KORISNICI_PROMJENA} element={<KorisnikPromjena />} />

                    <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
                    <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />
                    <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijaPromjena />} />

                    <Route path={RouteNames.STATUSI} element={<StatusPregled />} />
                    <Route path={RouteNames.STATUSI_NOVI} element={<StatusNovi />} />
                    <Route path={RouteNames.STATUSI_PROMJENA} element={<StatusPromjena />} />

                    <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GenerirajPodatke />} />
                  </>  
                )}
              </>
            ):(
              <>
                <Route path={RouteNames.LOGIN} element={<Login />} />
                <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
              </>
            )}


          </Routes>
        </Container>
        <hr />
          &copy; {IME_APLIKACIJE}
      </Container>
    </>
  )
}

export default App
