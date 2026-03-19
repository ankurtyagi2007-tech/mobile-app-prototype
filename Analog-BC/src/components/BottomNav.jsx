import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, MessageCircle } from 'lucide-react';

const tabs = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/experiences', label: 'Experiences', icon: Sparkles },
  { path: '/community', label: 'Community', icon: MessageCircle },
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
        background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        borderTop: '0.5px solid rgba(44,24,16,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: '8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        zIndex: 50,
      }}
    >
      {tabs.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 20px',
              position: 'relative',
            }}
          >
            <Icon
              size={22}
              color={isActive ? '#C4713B' : '#8B7E74'}
              strokeWidth={1.5}
            />
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                color: isActive ? '#C4713B' : '#8B7E74',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.2px',
              }}
            >
              {label}
            </span>
            {/* Active dot indicator */}
            {isActive && (
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#C4713B',
                  marginTop: '1px',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
