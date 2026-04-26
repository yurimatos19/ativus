import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 1,
  name: 'Mariana Costa',
  email: 'mariana@empresa.com.br',
  role: 'Gestora de RH',
  company: 'Empresa Modelo Ltda',
  cnpj: '12.345.678/0001-90',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    // Demo: accept any credentials
    setUser({ ...DEMO_USER, email })
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
