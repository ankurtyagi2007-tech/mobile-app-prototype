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
        {/* Top bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--color-divider)',
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

        {/* Business cards */}
        <div
          style={{
            padding: '0 16px 100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
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
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => navigate(`/business/${business.id}`)}
                style={{
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  height: 'calc(85dvh - 60px)',
                  minHeight: '580px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {/* Background image */}
                <img
                  src={`https://picsum.photos/seed/${business.imageSeed}/390/700`}
                  alt={business.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Gradient */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(44,24,16,0.9) 0%, rgba(44,24,16,0.4) 40%, transparent 60%)',
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px 24px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '30px',
                      fontWeight: 600,
                      color: '#FAF7F2',
                      margin: '0 0 4px',
                      lineHeight: 1.15,
                    }}
                  >
                    {business.name}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'rgba(250,247,242,0.7)',
                      margin: '0 0 20px',
                      fontWeight: 400,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {business.category}
                  </p>

                  {/* Stats row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '20px', fontWeight: 600, color: '#FAF7F2' }}>
                        {enrollment.visits}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(250,247,242,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Visits
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '20px', fontWeight: 600, color: '#FAF7F2' }}>
                        {enrollment.points}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(250,247,242,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Points
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: '#FAF7F2' }}>
                        {enrollment.currentTier}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(250,247,242,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tier
                      </span>
                    </div>
                  </div>

                  {/* Next unlock */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--color-accent)',
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    Next: {enrollment.nextUnlock}
                  </p>
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
