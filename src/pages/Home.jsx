import React, {useEffect, useState} from 'react'
import {getParticipants, getMatches} from '../services/storage'

export default function Home({onNavigate}){
  const [participantsCount, setParticipantsCount] = useState(0)
  const [matchesCount, setMatchesCount] = useState(0)
  const [nextMatch, setNextMatch] = useState(null)
  const [recentResultsCount, setRecentResultsCount] = useState(0)

  useEffect(()=>{
    (async()=>{
      const parts = await getParticipants() || []
      setParticipantsCount(parts.length)
      const matches = await getMatches() || []
      setMatchesCount(matches.length)

      // next upcoming match (closest date >= today)
      const now = new Date()
      const upcoming = matches.map(m=> ({...m, dateObj: m.date ? new Date(m.date) : null})).filter(m=>m.dateObj && m.dateObj >= now).sort((a,b)=> a.dateObj - b.dateObj)[0]
      setNextMatch(upcoming || (matches[0] || null))

      // count total recorded results across matches
      const totalResults = matches.reduce((acc,m)=> acc + ((m.results && m.results.length) || 0), 0)
      setRecentResultsCount(totalResults)
    })()
  }, [])

  return (
    <div style={{maxWidth: '1400px', margin: '0 auto'}}>
      {/* Hero Section */}
      <div style={{marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #222'}}>
        <h1 className="text-warning" style={{fontSize: '3rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem'}}>Rhema Society</h1>
        <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: 0}}>Organize participantes, partidas e a operação de peladas</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div 
            style={{
              background: 'linear-gradient(344  deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h6 className="text-muted mb-3" style={{fontSize: '0.9rem', fontWeight: '600'}}><i class="bi bi-person-circle" style={{color: 'white', fontSize: "30px", paddingRight: '5px'}}></i> Participantes</h6>
              <div className="d-flex align-items-baseline justify-content-between">
                <div>
                  <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffc107'}}>{participantsCount}</div>
                  <p className="text-muted small mb-0">Cadastrados</p>
                </div>
              </div>
            </div>
            <button 
              className="btn btn-warning mt-3" 
              onClick={()=>onNavigate('participants')}
              style={{
                fontWeight: '600',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              Gerenciar
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div 
            style={{
              background: 'linear-gradient(344deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h6 className="text-muted mb-3" style={{fontSize: '0.9rem', fontWeight: '600'}}><i class="bi bi-controller" style={{color: 'white', fontSize: "30px", paddingRight: '5px'}}></i> Partidas</h6>
              <div className="d-flex align-items-baseline justify-content-between">
                <div>
                  <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffc107'}}>{matchesCount}</div>
                  <p className="text-muted small mb-0">Criadas</p>
                </div>
              </div>
            </div>
            <button 
              className="btn btn-warning mt-3" 
              onClick={()=>onNavigate('matches')}
              style={{
                fontWeight: '600',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              Ver Partidas
            </button>
          </div>
        </div>
      </div>

      {/* Next Match and Shortcuts */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div 
            style={{
              background: 'linear-gradient(344deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              height: '100%'
            }}
          >
            <h6 className="text-muted mb-4" style={{fontSize: '0.9rem', fontWeight: '600'}}><i class="bi bi-calendar-date" style={{color: 'white', fontSize: "30px", paddingRight: '5px'}}></i> Próxima Partida</h6>
            {nextMatch ? (
              <div>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffc107', marginBottom: '0.5rem'}}>{nextMatch.title}</div>
                <p className="text-muted mb-4" style={{fontSize: '0.95rem'}}>
                  {nextMatch.date ? new Date(nextMatch.date).toLocaleDateString('pt-BR') : 'Data não definida'}
                </p>
                <button 
                  className="btn btn-warning"
                  onClick={()=>onNavigate('matches')}
                  style={{
                    fontWeight: '600',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  Abrir Partida
                </button>
              </div>
            ) : (
              <div className="text-muted text-center py-5">
                <p style={{fontSize: '3rem', marginBottom: '1rem'}}><i class="bi bi-calendar2-week"></i></p>
                <p>Nenhuma partida agendada</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div 
            style={{
              background: 'linear-gradient(344deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              height: '100%'
            }}
          >
            <h6 className="text-muted mb-4" style={{fontSize: '0.9rem', fontWeight: '600'}}><i class="bi bi-caret-right" style={{color: 'white', fontSize: "30px"}}></i> Atalhos Rápidos</h6>
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn btn-outline-light"
                onClick={()=>onNavigate('participants')}
                style={{
                  padding: '0.75rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  border: '1px solid #555',
                  justifyContent: 'flex-start'
                }}
              >
                + Adicionar Participante
              </button>
              <button 
                className="btn btn-outline-light"
                onClick={()=>onNavigate({name:'matches', openCreate:true})}
                style={{
                  padding: '0.75rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  border: '1px solid #555',
                  justifyContent: 'flex-start'
                }}
              >
                + Criar Partida
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mt-2 mb-4">
        <div className="col-12">
          <div 
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #151515 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* <div style={{textAlign: 'center', borderRight: '1px solid #333', paddingRight: '1rem'}}>
              <div style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem'}}>Resultados Registrados</div>
              <div style={{fontSize: '2rem', fontWeight: '700', color: '#ffc107'}}>{recentResultsCount}</div>
            </div> //ABA RESULTADOS REGISTRADOS REMOVIDA*/} 
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem'}}>Status</div>
              <div style={{fontSize: '1rem', color: '#4ade80'}}>✓ Sistema Operacional</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}