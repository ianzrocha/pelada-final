interface StarRatingProps {
  rating: number
  maxRating?: number
}

function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="d-flex gap-1">
      {[...Array(maxRating)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-warning' : 'text-muted'}>
          ⭐
        </span>
      ))}
    </div>
  )
}

export default StarRating
