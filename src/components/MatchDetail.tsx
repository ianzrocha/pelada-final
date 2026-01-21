import { useState } from 'react'
import type { Match } from '../types'
import MatchOrganization from './MatchOrganization'
import MatchTeams from './MatchTeams'
import MatchGame from './MatchGame'
import MatchResults from './MatchResults'

interface MatchDetailProps {
  match: Match
  onClose: () => void
}

function MatchDetail({ match, onClose }: MatchDetailProps) {
  const [activeTab, setActiveTab] = useState<'organization' | 'teams' | 'game' | 'results'>(
    'organization'
  )

  if (!match.id) return null

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-dark border-primary">
          <div className="modal-header border-primary">
            <h5 className="modal-title text-primary fw-bold">{match.title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs bg-dark border-bottom border-primary" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold ${activeTab === 'organization' ? 'active text-primary' : 'text-light'}`}
                onClick={() => setActiveTab('organization')}
                type="button"
              >
                📋 Organização
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold ${activeTab === 'teams' ? 'active text-primary' : 'text-light'}`}
                onClick={() => setActiveTab('teams')}
                type="button"
              >
                👥 Times
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold ${activeTab === 'game' ? 'active text-primary' : 'text-light'}`}
                onClick={() => setActiveTab('game')}
                type="button"
              >
                ⚽ Partida
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold ${activeTab === 'results' ? 'active text-primary' : 'text-light'}`}
                onClick={() => setActiveTab('results')}
                type="button"
              >
                📊 Resultados
              </button>
            </li>
          </ul>

          {/* Content */}
          <div className="modal-body">
            {activeTab === 'organization' && <MatchOrganization matchId={match.id} />}
            {activeTab === 'teams' && <MatchTeams matchId={match.id} />}
            {activeTab === 'game' && <MatchGame matchId={match.id} />}
            {activeTab === 'results' && <MatchResults matchId={match.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDetail
