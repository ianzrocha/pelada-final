import React, { useEffect, useState } from "react";
import { getParticipants } from "../services/storage";
import OrganizePlayersSection from "./OrganizePlayersSection";
import TeamsSection from "./TeamsSection";
import MatchResultsSection from "./MatchResultsSection";

function avgSkill(p) {
  return ((p.offense || 0) + (p.defense || 0) + (p.speed || 0)) / 3;
}

export default function MatchDetail({ match, onSave }) {
  const [org, setOrg] = useState(match.organization || []);
  const [allPlayers, setAllPlayers] = useState([]);
  const [teams, setTeams] = useState({ a: [], b: [], avgA: 0, avgB: 0 });
  const [results, setResults] = useState(match.results || []);

  useEffect(() => {
    (async () => {
      setAllPlayers(await getParticipants());
    })();
  }, []);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setOrg(match.organization || []);
  }, [match]);

  function moveUp(i) {
    if (i <= 0) return;
    const copy = [...org];
    [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
    setOrg(copy);
  }

  function moveDown(i) {
    if (i >= org.length - 1) return;
    const copy = [...org];
    [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
    setOrg(copy);
  }

  function removeAt(i) {
    const copy = [...org];
    copy.splice(i, 1);
    setOrg(copy);
  }

  function addPlayer(id) {
    if (!id) return;
    setOrg((s) => [...s, id]);
  }

  function buildTeams() {
    const roster = org
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter(Boolean);
    // separate juiz (judge) out and goleiro count
    const judges = roster.filter((p) => p.position === "juiz");
    const keepers = roster.filter((p) => p.position === "goleiro");
    const others = roster.filter(
      (p) => p.position !== "juiz" && p.position !== "goleiro",
    );

    // compute skill
    const players = others.map((p) => ({ ...p, skill: avgSkill(p) }));

    // greedy balance by skill (descending)
    players.sort((a, b) => b.skill - a.skill);
    const teamA = [];
    const teamB = [];
    const maxPerTeam = 6;

    const avg = (arr) =>
      arr.length ? arr.reduce((s, x) => s + avgSkill(x), 0) / arr.length : 0;

    players.forEach((pl) => {
      const aAvg = avg(teamA);
      const bAvg = avg(teamB);
      // choose the team with fewer players or lower avg, respect max
      if (
        (teamA.length < teamB.length && teamA.length < maxPerTeam) ||
        (teamA.length < maxPerTeam && aAvg <= bAvg)
      ) {
        teamA.push(pl);
      } else if (teamB.length < maxPerTeam) {
        teamB.push(pl);
      } else if (teamA.length < maxPerTeam) {
        teamA.push(pl);
      } else {
        // overflow: place in A
        teamA.push(pl);
      }
    });

    // assign goalkeepers by arrival order to teams if present, do not count them in balance
    if (keepers.length) {
      if (keepers[0]) teamA.unshift(keepers[0]);
      if (keepers[1]) teamB.unshift(keepers[1]);
      // extra keepers appended to A
      for (let i = 2; i < keepers.length; i++) teamA.push(keepers[i]);
    }

    const avgA = avg(teamA);
    const avgB = avg(teamB);

    setTeams({ a: teamA, b: teamB, avgA, avgB, judges });
  }

  function save() {
    const payload = { ...match, organization: org, results };
    onSave(payload);
  }

  function addResult(newResult) {
    setResults((r) => [...r, newResult]);
  }

  return (
    <div className="match-detail-container">
      <OrganizePlayersSection
        organization={org}
        allPlayers={allPlayers}
        onAddPlayer={addPlayer}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onRemove={removeAt}
        onSave={save}
      />

      <TeamsSection teams={teams} onBuildTeams={buildTeams} />

      <MatchResultsSection
        match={match}
        results={results}
        teams={teams}
        allPlayers={allPlayers}
        onAddResult={addResult}
        onSave={save}
      />
    </div>
  );
}
