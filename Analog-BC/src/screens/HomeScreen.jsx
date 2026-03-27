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

  // First business is the hero; rest go to masonry grid
  const [heroBusiness, ...otherBusinesses] = enrolledBusinesses;

  // Masonry layout pattern: alternate tall/wide cards for true asymmetry
  // Pattern repeats: [tall-left, short-right, short-right, wide-full, short-left, tall-right]
  const getMasonryStyle = (index) => {
    const patterns = [
      { gridColumn: '1 / 2', height: '280px' },    // tall left
      { gridColumn: '2 / 3', height: '130px' },     // short right top
      { gridColumn: '2 / 3', height: '130px' },     // short right bottom
      { gridColumn: '1 / 3', height: '200px' },     // wide full
    ];
    return patterns[index % patterns.length];
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: '80px' }}>

        {/* Top bar */}
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

        {/* Primary Hero — 85vh full-bleed */}
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

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 24px 28px',
                }}
              >
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

        {/* Your Places — Masonry Grid */}
        {otherBusinesses.length > 0 && (
          <div style={{ padding: '40px 16px 0' }}>
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
                paddingLeft: '4px',
                letterSpacing: '0.3px',
              }}
            >
              Your Places
            </motion.h2>

            {/* Two-column masonry grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {otherBusinesses.map((business, index) => {
                const enrollment = currentUser.enrollments[business.id];
                const style = getMasonryStyle(index);
                const isWide = style.gridColumn === '1 / 3';
                const isTall = style.height === '280px';

                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/business/${business.id}`)}
                    style={{
                      gridColumn: style.gridColumn,
                      height: style.height,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Image */}
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

                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(
                          to top,
                          rgba(20,12,8,0.85) 0%,
                          rgba(20,12,8,0.3) 50%,
                          transparent 100%
                        )`,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Content overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: isWide ? '16px 18px' : isTall ? '16px 14px' : '10px 12px',
                      }}
                    >
                      {/* Category — only show on tall and wide cards */}
                      {(isTall || isWide) && (
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '9px',
                            color: 'rgba(250,248,245,0.5)',
                            margin: '0 0 4px',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {business.category}
                        </p>
                      )}

                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: isWide ? '24px' : isTall ? '20px' : '16px',
                          fontWeight: 500,
                          color: '#FAF8F5',
                          margin: 0,
                          lineHeight: 1.1,
                          letterSpacing: '0.3px',
                        }}
                      >
                        {business.name}
                      </h3>

                      {/* Stats — show on tall and wide cards */}
                      {(isTall || isWide) && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              color: 'rgba(250,248,245,0.6)',
                              fontWeight: 400,
                            }}
                          >
                            {enrollment?.visits} visits
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              color: 'rgba(250,248,245,0.6)',
                              fontWeight: 400,
                            }}
                          >
                            {enrollment?.points} pts
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '11px',
                              color: 'rgba(250,248,245,0.7)',
                              fontStyle: 'italic',
                            }}
                          >
                            {enrollment?.currentTier}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
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
