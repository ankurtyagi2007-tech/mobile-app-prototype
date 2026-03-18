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
        backgroundColor: '#2C1810',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
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
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 16px',
            }}
          >
            <Icon
              size={22}
              color={isActive ? '#C4713B' : '#FAF7F2'}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                color: isActive ? '#C4713B' : '#FAF7F2',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
