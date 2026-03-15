import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import KorisniciPregled from './pages/korisnici/KorisniciPregled'

function App() {

  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.KORISNICI} element={<KorisniciPregled />} />
      </Routes>
      <hr />
      &copy, {IME_APLIKACIJE}
    </Container>
  )
}

export default App
