import React, { useState } from "react";
import StarRating from "./StarRating";
import { updateParticipant, removeParticipant } from "../services/storage";

export default function ParticipantEditor({ participant, onClose, onSaved }) {
  const [form, setForm] = useState({ ...participant });
  const [saving, setSaving] = useState(false);

  function handleChange(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateParticipant(form.id, form);
    setSaving(false);
    onSaved && onSaved(form);
    onClose && onClose();
  }

  async function handleDelete() {
    if (!confirm("Remover participante?")) return;
    setSaving(true);
    await removeParticipant(form.id);
    setSaving(false);
    onSaved && onSaved({ deleted: true, id: form.id });
    onClose && onClose();
  }

  return (
    <div className="participant-editor" style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", zIndex: 120 }}>
      <div style={{ position: 'absolute', inset:0, background:'rgba(2,6,23,0.6)' }} onClick={onClose} />
      <div style={{ width: 520, maxWidth: "95%", background: "#07101a", border: "1px solid rgba(255,255,255,0.04)", padding: 20, borderRadius: 12, boxShadow: "0 18px 50px rgba(2,6,23,0.75)", position:'relative', zIndex:121 }}>
        <form onSubmit={handleSave}>
          <h4 style={{ margin: 0, marginBottom: 12, color: "#ffc107" }}>Editar Participante</h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="form-label small muted">Nome</label>
              <div style={{ fontWeight: 700 }}>{participant.name}</div>
            </div>
            <div>
              <label className="form-label small muted">Apelido</label>
              <input className="form-control" value={form.fantasyName || ""} onChange={(e)=>handleChange('fantasyName', e.target.value)} style={{ marginTop: 6 }} />
            </div>
            <div>
              <label className="form-label small muted">Tipo Pagamento</label>
              <select className="form-select" value={form.paymentType || 'mensal'} onChange={(e)=>handleChange('paymentType', e.target.value)} style={{ marginTop: 6 }}>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div>
              <label className="form-label small muted">Ativo</label>
              <div style={{ marginTop: 6 }}>
                <input type="checkbox" checked={!!form.active} onChange={(e)=>handleChange('active', e.target.checked)} />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label small muted">Avaliações</label>
              <div style={{ display: 'flex', gap:12, marginTop:6 }}>
                <div style={{ flex: 1 }}>
                  <div className="small muted">Ofensivo</div>
                  <StarRating value={form.offense||0} onChange={(v)=>handleChange('offense', v)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="small muted">Defensivo</div>
                  <StarRating value={form.defense||0} onChange={(v)=>handleChange('defense', v)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="small muted">Velocidade</div>
                  <StarRating value={form.speed||0} onChange={(v)=>handleChange('speed', v)} />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label small muted">Gols</label>
              <input type="number" className="form-control" value={form.goals||0} onChange={(e)=>handleChange('goals', Number(e.target.value))} style={{ marginTop:6 }} />
            </div>
            <div>
              <label className="form-label small muted">G. Contra</label>
              <input type="number" className="form-control" value={form.ownGoals||0} onChange={(e)=>handleChange('ownGoals', Number(e.target.value))} style={{ marginTop:6 }} />
            </div>
            <div>
              <label className="form-label small muted">Faltas</label>
              <input type="number" className="form-control" value={form.fouls||0} onChange={(e)=>handleChange('fouls', Number(e.target.value))} style={{ marginTop:6 }} />
            </div>
            <div>
              <label className="form-label small muted">Cartões</label>
              <input type="number" className="form-control" value={form.cards||0} onChange={(e)=>handleChange('cards', Number(e.target.value))} style={{ marginTop:6 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap:12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={handleDelete} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.06)' }}>Excluir</button>
            <button type="button" className="btn btn-outline-light" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving? 'Salvando...':'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
