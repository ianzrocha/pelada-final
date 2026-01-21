import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Participants from './pages/Participants'
import Matches from './pages/Matches'
import Admin from './pages/Admin'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'participants' | 'matches' | 'admin'>('home')

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-warning" style={{ borderWidth: '3px !important' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-warning fs-4" href="#" onClick={() => setCurrentPage('home')}>
            ⚽ Rhema Society
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'home' ? 'active text-warning' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('home')}
                >
                  Início
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'participants' ? 'active text-warning' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('participants')}
                >
                  Participantes
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'matches' ? 'active text-warning' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('matches')}
                >
                  Partidas
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'admin' ? 'active text-warning' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('admin')}
                >
                  Administração
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'participants' && <Participants />}
        {currentPage === 'matches' && <Matches />}
        {currentPage === 'admin' && <Admin />}
      </main>

      {/* Footer */}
      <footer className="footer bg-dark border-top border-warning mt-5">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6 className="text-warning fw-bold">Pelada Manager</h6>
              <p className="text-light small">Sistema de gerenciamento de partidas de futebol</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-warning fw-bold">Menu Rápido</h6>
              <ul className="list-unstyled small">
                <li><a href="#" className="text-light text-decoration-none">Participantes</a></li>
                <li><a href="#" className="text-light text-decoration-none">Partidas</a></li>
                <li><a href="#" className="text-light text-decoration-none">Admin</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-warning fw-bold">Contato</h6>
              <p className="text-light small">© 2026 Rhema Society</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomePage() {
  const [stats] = useState({
    participants: 0,
    matches: 0,
    nextMatch: null as any
  })

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="text-warning text-center mb-4" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            🏟️ Bem-vindo ao Rhema Society
          </h1>
          <p className="text-center text-light fs-5">
            Gerencie suas partidas, participantes e estatísticas em um só lugar
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-dark border-warning h-100 shadow-lg">
            <div className="card-body text-center">
              <h3 className="text-warning mb-3">📋 Participantes</h3>
              <h2 className="text-light mb-3">{stats.participants}</h2>
              <p className="text-light mb-3">Gerenciadores cadastrados</p>
              <button className="btn btn-warning fw-bold">Ver Participantes</button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card bg-dark border-warning h-100 shadow-lg">
            <div className="card-body text-center">
              <h3 className="text-warning mb-3">⚽ Partidas</h3>
              <h2 className="text-light mb-3">{stats.matches}</h2>
              <p className="text-light mb-3">Partidas realizadas</p>
              <button className="btn btn-warning fw-bold">Ver Partidas</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="card bg-dark border-warning shadow-lg">
            <div className="card-body">
              <h4 className="text-warning mb-4">📊 Próximas Ações</h4>
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action bg-dark border-warning text-light">
                  ➕ Adicionar novo participante
                </a>
                <a href="#" className="list-group-item list-group-item-action bg-dark border-warning text-light">
                  ⚽ Criar nova partida
                </a>
                <a href="#" className="list-group-item list-group-item-action bg-dark border-warning text-light">
                  📈 Ver estatísticas
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
