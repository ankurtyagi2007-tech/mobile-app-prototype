import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, MessageCircle } from 'lucide-react';

const tabs = [
  { path: '/home', icon: Home },
  { path: '/experiences', icon: Sparkles },
  { path: '/community', icon: MessageCircle },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(250,248,245,0.88)',
        backdropFilter: 'blur(24px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
        borderTop: '0.5px solid rgba(44,24,16,0.05)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        zIndex: 50,
      }}
    >
      {tabs.map(({ path, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 24px',
              position: 'relative',
            }}
          >
            <Icon
              size={20}
              color={isActive ? '#8B6914' : '#C4BAB0'}
              strokeWidth={1}
            />
            {isActive && (
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#8B6914',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
