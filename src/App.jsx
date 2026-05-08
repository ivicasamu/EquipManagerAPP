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
import KorisnikPromjenaLozinke from './pages/korisnici/KorisnikPromjenaLozinke'
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

            {/* LOGIN / REGISTRACIJA */}
            <Route
              path={RouteNames.LOGIN}
              element={
                !isLoggedIn 
                  ? <Login /> 
                  : authUser?.administrator
                    ? <Navigate to={RouteNames.NADZORNA_PLOCA} />
                    : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.REGISTRACIJA}
              element={!isLoggedIn ? <Registracija /> : <Navigate to={RouteNames.NADZORNA_PLOCA} />}
            />

            {/* UREĐAJI */}
            <Route
              path={RouteNames.UREDJAJI}
              element={isLoggedIn ? <UredjajPregled /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.UREDJAJI_NOVI}
              element={isLoggedIn ? <UredjajNovi /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.UREDJAJI_PROMJENA}
              element={isLoggedIn ? <UredjajPromjena /> : <Navigate to={RouteNames.LOGIN} />}
            />

            {/* KLIJENTI */}
            <Route
              path={RouteNames.KLIJENTI}
              element={isLoggedIn ? <KlijentPregled /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.KLIJENTI_NOVI}
              element={isLoggedIn ? <KlijentNovi /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.KLIJENTI_PROMJENA}
              element={isLoggedIn ? <KlijentPromjena /> : <Navigate to={RouteNames.LOGIN} />}
            />

            {/* EVENTI */}
            <Route
              path={RouteNames.EVENTI}
              element={isLoggedIn ? <EventPregled /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.EVENTI_NOVI}
              element={isLoggedIn ? <EventNovi /> : <Navigate to={RouteNames.LOGIN} />}
            />
            <Route
              path={RouteNames.EVENTI_PROMJENA}
              element={isLoggedIn ? <EventPromjena /> : <Navigate to={RouteNames.LOGIN} />}
            />

            {/* ADMIN ONLY */}

            <Route
              path={RouteNames.NADZORNA_PLOCA}
              element={
                isLoggedIn 
                  ? <NadzornaPloca /> 
                  : location.pathname !== RouteNames.LOGIN
                    ? <Navigate to={RouteNames.LOGIN} />
                    : <NadzornaPloca />
              }
            />

            <Route
              path={RouteNames.KORISNICI}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KorisnikPregled />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.KORISNICI_NOVI}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KorisnikNovi />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.KORISNICI_PROMJENA}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KorisnikPromjena />
                  : <Navigate to={RouteNames.HOME} />
              }
            />

             <Route
              path={RouteNames.KORISNICI_PROMJENA_LOZINKE}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KorisnikPromjenaLozinke />
                  : <Navigate to={RouteNames.HOME} />
              }
            />

            <Route
              path={RouteNames.KATEGORIJE}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KategorijaPregled />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.KATEGORIJE_NOVI}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KategorijaNovi />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.KATEGORIJE_PROMJENA}
              element={
                isLoggedIn && authUser?.administrator
                  ? <KategorijaPromjena />
                  : <Navigate to={RouteNames.HOME} />
              }
            />

            <Route
              path={RouteNames.STATUSI}
              element={
                isLoggedIn && authUser?.administrator
                  ? <StatusPregled />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.STATUSI_NOVI}
              element={
                isLoggedIn && authUser?.administrator
                  ? <StatusNovi />
                  : <Navigate to={RouteNames.HOME} />
              }
            />
            <Route
              path={RouteNames.STATUSI_PROMJENA}
              element={
                isLoggedIn && authUser?.administrator
                  ? <StatusPromjena />
                  : <Navigate to={RouteNames.HOME} />
              }
            />

            <Route
              path={RouteNames.GENERIRANJE_PODATAKA}
              element={
                isLoggedIn && authUser?.administrator
                  ? <GenerirajPodatke />
                  : <Navigate to={RouteNames.HOME} />
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to={RouteNames.HOME} />} />
          </Routes>
        </Container>
        <hr />
          &copy; {IME_APLIKACIJE}
      </Container>
    </>
  )
}

export default App
