import React from 'react'

export default function StarRating({value=0, onChange, readonly=false}){
  const stars = [1,2,3,4,5]
  return (
    <div className="star-rating" style={{display:'inline-flex', gap:4}}>
      {stars.map((s)=> (
        <button key={s} type="button" className="btn btn-link p-0" onClick={(e)=>{e.preventDefault(); if(!readonly && onChange) onChange(s)}} aria-label={`Set ${s} stars`}>
          <span style={{fontSize:18, color: s<=value ? '#f6c84c' : '#6c6c6c'}}>{s<=value ? '★' : '☆'}</span>
        </button>
      ))}
    </div>
  )
}
