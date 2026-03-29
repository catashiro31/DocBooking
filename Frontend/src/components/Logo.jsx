import React from 'react';

const Logo = ({ size = 'normal', color = 'primary', showText = true, className = '' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  
  const iconSize = isLarge ? 42 : isSmall ? 28 : 34;
  const fontSize = isLarge ? 24 : isSmall ? 16 : 20;

  return (
    <div 
      className={`logo-container ${className}`} 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isSmall ? '8px' : '10px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div 
        className="logo-icon" 
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: isSmall ? '8px' : '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          flexShrink: 0
        }}
      >
        <svg 
          width={iconSize * 0.6} 
          height={iconSize * 0.6} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      
      {showText && (
        <span 
          className="logo-text" 
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: 800,
            color: color === 'white' ? '#fff' : '#0f172a',
            letterSpacing: '-0.03em',
            fontFamily: "'Inter', -apple-system, sans-serif"
          }}
        >
          Doc<span style={{ color: color === 'white' ? '#fff' : '#6366f1' }}>Booking</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
