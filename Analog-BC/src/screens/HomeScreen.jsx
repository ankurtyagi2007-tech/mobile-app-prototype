import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import businesses from '../data/businesses';
import PageTransition from '../components/PageTransition';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const enrolledBusinesses = businesses.filter(
    (b) => currentUser.enrollments[b.id]?.enrolled
  );

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)' }}>
        {/* Top bar — refined */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'rgba(250,247,242,0.92)',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '26px',
              fontWeight: 400,
              color: 'var(--color-text)',
              margin: 0,
              letterSpacing: '2px',
            }}
          >
            Analog
          </h1>
          <button
            onClick={() => navigate('/profile')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid rgba(44,24,16,0.1)',
              padding: 0,
              cursor: 'pointer',
              background: 'none',
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>
        </div>

        {/* Business cards — immersive full-viewport */}
        <div
          style={{
            padding: '0 16px 100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            scrollSnapType: 'y mandatory',
            overflowY: 'auto',
          }}
        >
          {enrolledBusinesses.map((business, index) => {
            const enrollment = currentUser.enrollments[business.id];
            return (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ scale: 1.005 }}
                onClick={() => navigate(`/business/${business.id}`)}
                style={{
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  height: 'calc(85dvh - 60px)',
                  minHeight: '580px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {/* Background image */}
                <img
                  src={business.heroImage}
                  alt={business.name}
                  className="img-mood"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Sophisticated gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(
                      to top,
                      rgba(36,20,12,0.92) 0%,
                      rgba(36,20,12,0.7) 25%,
                      rgba(36,20,12,0.25) 50%,
                      rgba(36,20,12,0.05) 70%,
                      transparent 100%
                    )`,
                  }}
                />

                {/* Content — editorial layout */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '36px 28px',
                  }}
                >
                  {/* Category label */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: 'rgba(250,247,242,0.5)',
                      margin: '0 0 8px',
                      fontWeight: 400,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {business.category}
                  </p>

                  {/* Business name — editorial */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '36px',
                      fontWeight: 500,
                      color: '#FAF7F2',
                      margin: '0 0 20px',
                      lineHeight: 1.1,
                      letterSpacing: '1px',
                    }}
                  >
                    {business.name}
                  </h2>

                  {/* Stats row — editorial style */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '28px',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: 600, color: '#FAF7F2', lineHeight: 1 }}>
                        {enrollment.visits}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(250,247,242,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
                        Visits
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: 600, color: '#FAF7F2', lineHeight: 1 }}>
                        {enrollment.points}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(250,247,242,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
                        Points
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 500, color: 'rgba(250,247,242,0.8)', fontStyle: 'italic', lineHeight: 1.2 }}>
                        {enrollment.currentTier}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(250,247,242,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
                        Tier
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
}
