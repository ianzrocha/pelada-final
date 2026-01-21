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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-primary page-hero" style={{ borderWidth: '1px', padding: '20px 30px' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary fs-4" href="#" onClick={() => setCurrentPage('home')}>
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
                  className={`nav-link fw-bold ${currentPage === 'home' ? 'active text-primary' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('home')}
                >
                  Início
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'participants' ? 'active text-primary' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('participants')}
                >
                  Participantes
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'matches' ? 'active text-primary' : 'text-light'}`}
                  href="#"
                  onClick={() => setCurrentPage('matches')}
                >
                  Partidas
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link fw-bold ${currentPage === 'admin' ? 'active text-primary' : 'text-light'}`}
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
      <footer className="footer bg-dark border-top border-primary mt-5">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6 className="text-primary fw-bold">Pelada Manager</h6>
              <p className="text-light small">Sistema de gerenciamento de partidas de futebol</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-primary fw-bold">Menu Rápido</h6>
              <ul className="list-unstyled small">
                <li><a href="#" className="text-light text-decoration-none">Participantes</a></li>
                <li><a href="#" className="text-light text-decoration-none">Partidas</a></li>
                <li><a href="#" className="text-light text-decoration-none">Admin</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="text-primary fw-bold">Contato</h6>
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
        <div className="col-lg-10 mx-auto">
          <div className="page-hero" style={{ borderWidth: '1px', borderRadius: '20px' }}>
            <div>
              <h1 className="mb-2">🏟️ Pelada Manager</h1>
              <p className="text-light" style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                Gerencie suas partidas e participantes com tecnologia avançada
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-10 mx-auto">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 text-center hover-card" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                  <h3 className="text-primary mb-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Participantes</h3>
                  <h2 className="text-light mb-3" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.participants}</h2>
                  <p className="text-light small mb-3">Jogadores cadastrados</p>
                  <button className="btn btn-primary fw-bold">Gerenciar</button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 text-center hover-card" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚽</div>
                  <h3 className="text-primary mb-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Partidas</h3>
                  <h2 className="text-light mb-3" style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.matches}</h2>
                  <p className="text-light small mb-3">Jogos realizados</p>
                  <button className="btn btn-primary fw-bold">Ver Partidas</button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 text-center hover-card" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
                  <h3 className="text-primary mb-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin</h3>
                  <p className="text-light small mb-3" style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '30px' }}>Controlar</p>
                  <p className="text-light small mb-3">Painel administrativo</p>
                  <button className="btn btn-primary fw-bold">Acessar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-body">
              <h4 className="text-primary mb-4" style={{ fontSize: '1.3rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                📊 Funcionalidades
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ fontSize: '1.8rem' }}>✨</div>
                    <div>
                      <h6 className="text-primary mb-1">Gerenciamento Inteligente</h6>
                      <p className="text-light small mb-0">Controle total de participantes e estatísticas em tempo real</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ fontSize: '1.8rem' }}>🤖</div>
                    <div>
                      <h6 className="text-primary mb-1">Mistura Automática</h6>
                      <p className="text-light small mb-0">Algoritmo avançado para criar times equilibrados</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ fontSize: '1.8rem' }}>📈</div>
                    <div>
                      <h6 className="text-primary mb-1">Análise Completa</h6>
                      <p className="text-light small mb-0">Estatísticas detalhadas de desempenho dos participantes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div style={{ fontSize: '1.8rem' }}>💾</div>
                    <div>
                      <h6 className="text-primary mb-1">Armazenamento Seguro</h6>
                      <p className="text-light small mb-0">Dados protegidos com tecnologia em nuvem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
