import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KorisnikPregled from './pages/korisnici/KorisnikPregled'
import KorisnikNovi from './pages/korisnici/KorisnikNovi'
import KorisnikPromjena from './pages/korisnici/KorisnikPromjena'

function App() {

  return (
    <Container>
      <h4 class="localhostOznaka">LOKALNO</h4>
      <Izbornik />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.KORISNICI} element={<KorisnikPregled />} />
          <Route path={RouteNames.KORISNICI_NOVI} element={<KorisnikNovi />} />
          <Route path={RouteNames.KORISNICI_PROMJENA} element={<KorisnikPromjena />} />
        </Routes>
        <hr />
        &copy; {IME_APLIKACIJE}
      </Container>
    </Container>
    
  )
}

export default App
