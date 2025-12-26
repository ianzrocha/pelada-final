import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Participants from './pages/Participants'
import Matches from './pages/Matches'
import Admin from './pages/Admin'
// Footer was removed — nav is inlined into the navbar

function App() {
  const [route, setRoute] = useState({name:'home'})

  const navigate = (to) => {
    // to can be string 'home' or object {name:'matches', openCreate:true}
    if(typeof to === 'string') setRoute({name: to})
    else setRoute(to)
  }

  return (
    <div className="min-vh-100 bg-dark text-light">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{background:'#090909', borderBottom:'none'}}>
        <div className="app-container">
          <div className="nav-actions">
            <ul className="nav-actions-list">
              <li className={`nav-item ${route.name==='home' ? 'active' : ''}`} onClick={()=>navigate('home')}>
                <span className="nav-icon"> 
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="nav-label">Início</span>
              </li>
              <li className={`nav-item ${route.name==='participants' ? 'active' : ''}`} onClick={()=>navigate('participants')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20c0-2.21 4-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="nav-label">Participantes</span>
              </li>
              <li className={`nav-item ${route.name==='matches' ? 'active' : ''}`} onClick={()=>navigate({name:'matches'})}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-2-2h-2V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2H5a2 2 0 0 0-2 2v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="7" y="11" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="nav-label">Partidas</span>
              </li>
              <li className={`nav-item ${route.name==='admin' ? 'active' : ''}`} onClick={()=>navigate('admin')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 16.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.67 0 1.29-.36 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 3.08A2 2 0 1 1 7.12.25l.06.06c.5.5 1.21.66 1.82.33.7-.34 1.5-.35 2.2 0 .61.33 1.32.17 1.82-.33l-.06-.06A2 2 0 1 1 18.3 3.08l-.06.06c-.66.67-.67 1.67-.33 2.2.33.61.17 1.32-.33 1.82-.34.7-.35 1.5 0 2.2.33.61 1.05 1.02 1.82.33l.06-.06A2 2 0 1 1 22 8h-.09c-.67 0-1.29.36-1.51 1-.21.65.01 1.35.33 1.82.33.61.17 1.32-.33 1.82z" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="nav-label">Administração</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="app-container">
        <div className="page-container py-4">
          {route.name === 'home' && <Home onNavigate={navigate} />}
          {route.name === 'participants' && <Participants />}
          {route.name === 'matches' && <Matches openCreate={route.openCreate} />}
          {route.name === 'admin' && <Admin />}
        </div>
      </main>

      
    </div>
  )
}

export default App
