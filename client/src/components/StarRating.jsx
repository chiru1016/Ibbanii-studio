import React from 'react';

/**
 * StarRating — reusable star display / picker
 *
 * Props:
 *  rating       {number}   — current rating value (0–5, supports decimals for display)
 *  interactive  {boolean}  — if true, renders clickable stars
 *  onChange     {function} — called with the new rating when a star is clicked
 *  size         {number}   — star size in px (default 20)
 *  showValue    {boolean}  — show the numeric value next to stars
 */
const StarRating = ({
  rating = 0,
  interactive = false,
  onChange,
  size = 20,
  showValue = false,
}) => {
  const [hovered, setHovered] = React.useState(0);

  const displayed = interactive ? (hovered || rating) : rating;

  const getStarType = (index) => {
    const val = displayed;
    if (val >= index) return 'full';
    if (val >= index - 0.5) return 'half';
    return 'empty';
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const type = getStarType(star);
        return (
          <span
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{
              fontSize: `${size}px`,
              lineHeight: 1,
              cursor: interactive ? 'pointer' : 'default',
              color: type === 'empty' ? '#ddd' : '#F59E0B',
              transition: 'color 0.15s, transform 0.15s',
              transform: interactive && hovered === star ? 'scale(1.2)' : 'scale(1)',
              display: 'inline-block',
            }}
            title={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
          >
            {type === 'full' ? '★' : type === 'half' ? '⭐' : '☆'}
          </span>
        );
      })}
      {showValue && rating > 0 && (
        <span style={{ fontSize: `${size * 0.7}px`, color: '#666', marginLeft: '4px', fontWeight: 600 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
};

export default StarRating;
