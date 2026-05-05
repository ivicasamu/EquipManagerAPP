import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import KorisnikService from '../services/korisnici/KorisnikService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    const korisnik = localStorage.getItem('korisnik');

    if (korisnik) {
      const parsed = JSON.parse(korisnik);
      setAuthUser(parsed)
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, []);

  async function login(korisnickoIme, lozinka) {
    const odgovor = await KorisnikService.prijava(korisnickoIme, lozinka);

    if (odgovor.success) {
      localStorage.setItem('korisnik', JSON.stringify(odgovor.data));
      setAuthUser(odgovor.data);
      setIsLoggedIn(true);
    } else {
      alert("Neispravni podaci");
      localStorage.removeItem('korisnik');
      setAuthUser({});
      setIsLoggedIn(false);
    }
  }

  function logout() {
    
    localStorage.removeItem('korisnik');
    setAuthUser('');
    setIsLoggedIn(false);
    navigate(RouteNames.HOME);
  }

  const value = {
    isLoggedIn,
    authUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}