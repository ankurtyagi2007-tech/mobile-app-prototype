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

  // First business is the hero; rest go to horizontal scroll
  const [heroBusiness, ...otherBusinesses] = enrolledBusinesses;

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: '80px' }}>

        {/* Top bar — refined */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '52px 20px 16px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 500,
              color: '#FAF8F5',
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
              border: '1.5px solid rgba(250,248,245,0.3)',
              padding: 0,
              cursor: 'pointer',
              background: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>
        </div>

        {/* Primary Hero — 85vh full-bleed, no border-radius */}
        {heroBusiness && (() => {
          const heroEnrollment = currentUser.enrollments[heroBusiness.id];
          return (
            <div
              onClick={() => navigate(`/business/${heroBusiness.id}`)}
              style={{
                position: 'relative',
                height: '85dvh',
                width: '100%',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {/* Hero image — full-bleed, no border-radius */}
              <div className="grain" style={{ position: 'absolute', inset: 0 }}>
                <img
                  src={heroBusiness.heroImage}
                  alt={heroBusiness.name}
                  className="img-mood"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Bottom gradient fading to --color-bg */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    to top,
                    var(--color-bg) 0%,
                    rgba(250,248,245,0) 40%
                  )`,
                  pointerEvents: 'none',
                }}
              />

              {/* Dark overlay for text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    to top,
                    rgba(36,20,12,0.75) 0%,
                    rgba(36,20,12,0.3) 35%,
                    transparent 60%
                  )`,
                  pointerEvents: 'none',
                }}
              />

              {/* Hero content overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 24px 28px',
                }}
              >
                {/* Category label */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'rgba(250,248,245,0.55)',
                    margin: '0 0 8px',
                    fontWeight: 400,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  {heroBusiness.category}
                </p>

                {/* Venue name — 48px Cormorant, white */}
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '48px',
                    fontWeight: 500,
                    color: '#FAF8F5',
                    margin: '0 0 16px',
                    lineHeight: 1.0,
                    letterSpacing: '0.5px',
                  }}
                >
                  {heroBusiness.name}
                </h2>

                {/* Stats row — 12px, overlaid on image below name */}
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-end',
                  }}
                >
                  {[
                    { value: heroEnrollment?.visits, label: 'Visits' },
                    { value: heroEnrollment?.points, label: 'Points' },
                    { value: heroEnrollment?.currentTier, label: 'Tier', isText: true },
                  ].map(({ value, label, isText }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontFamily: isText ? 'var(--font-heading)' : 'var(--font-body)',
                          fontSize: isText ? '14px' : '12px',
                          fontWeight: isText ? 400 : 600,
                          fontStyle: isText ? 'italic' : 'normal',
                          color: 'rgba(250,248,245,0.9)',
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          color: 'rgba(250,248,245,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          marginTop: '3px',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* "Your Places" section — below hero */}
        {otherBusinesses.length > 0 && (
          <div style={{ paddingTop: '40px' }}>
            {/* Section title */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: '0 0 20px',
                paddingLeft: '20px',
                letterSpacing: '0.3px',
              }}
            >
              Your Places
            </motion.h2>

            {/* Horizontal scroll — 260px wide, 180px tall cards, 8px border-radius */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {otherBusinesses.map((business, index) => {
                const enrollment = currentUser.enrollments[business.id];
                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/business/${business.id}`)}
                    style={{
                      flexShrink: 0,
                      width: '260px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '0.5px solid rgba(44,24,16,0.06)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    {/* Card image — 180px tall, 8px border-radius (top only) */}
                    <div
                      style={{
                        position: 'relative',
                        height: '180px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={business.heroImage}
                        alt={business.name}
                        className="img-mood"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {/* Subtle bottom gradient */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '60px',
                          background: 'linear-gradient(to top, rgba(36,20,12,0.4) 0%, transparent 100%)',
                        }}
                      />
                      {/* Category label on image */}
                      <p
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '12px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          color: 'rgba(250,248,245,0.7)',
                          margin: 0,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          fontWeight: 400,
                        }}
                      >
                        {business.category}
                      </p>
                    </div>

                    {/* Card content */}
                    <div style={{ padding: '14px 16px 16px' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '18px',
                          fontWeight: 500,
                          color: 'var(--color-text)',
                          margin: '0 0 6px',
                          lineHeight: 1.15,
                        }}
                      >
                        {business.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            color: 'var(--color-muted)',
                            fontWeight: 300,
                          }}
                        >
                          {enrollment?.visits} visits
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            color: 'var(--color-muted)',
                            fontWeight: 300,
                          }}
                        >
                          {enrollment?.points} pts
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '12px',
                            color: 'var(--color-accent)',
                            fontStyle: 'italic',
                            fontWeight: 400,
                          }}
                        >
                          {enrollment?.currentTier}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* If no enrolled businesses at all */}
        {enrolledBusinesses.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 32px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
                fontWeight: 400,
                color: 'var(--color-text)',
                margin: '0 0 12px',
              }}
            >
              Discover your places
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-muted)',
                margin: 0,
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Enroll at local spots to start collecting recognition
            </p>
          </div>
        )}

        <BottomNav />
      </div>
    </PageTransition>
  );
}
