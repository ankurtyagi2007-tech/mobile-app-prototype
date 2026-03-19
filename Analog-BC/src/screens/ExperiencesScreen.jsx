import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import experiences from '../data/experiences';
import businesses from '../data/businesses';

export default function ExperiencesScreen() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const enrolledBusinesses = useMemo(
    () => businesses.filter((b) => currentUser.enrollments[b.id]?.enrolled),
    [currentUser]
  );

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? experiences
        : experiences.filter((e) => e.businessId === activeFilter),
    [activeFilter]
  );

  const isEnrolled = (businessId) => currentUser.enrollments[businessId]?.enrolled;

  const getBusinessName = (businessId) =>
    businesses.find((b) => b.id === businessId)?.name || '';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const featuredExp = filtered[0];
  const gridExps = filtered.slice(1);

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ padding: '60px 20px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 48,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: 0,
            letterSpacing: '0.3px',
            lineHeight: 1.05,
          }}>
            Experiences
          </h1>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '20px 20px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <Chip
            label="All"
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          {enrolledBusinesses.map((b) => (
            <Chip
              key={b.id}
              label={b.name}
              active={activeFilter === b.id}
              onClick={() => setActiveFilter(b.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '32px 20px 24px' }}>

          {/* Featured Card — full-width, 280px image */}
          {featuredExp && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => isEnrolled(featuredExp.businessId) && navigate(`/experience/${featuredExp.id}`)}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface)',
                border: '0.5px solid rgba(44,24,16,0.06)',
                boxShadow: 'var(--shadow-card)',
                cursor: isEnrolled(featuredExp.businessId) ? 'pointer' : 'default',
                position: 'relative',
                marginBottom: 20,
              }}
            >
              {/* Featured image — 280px tall, full-bleed */}
              <div className="grain" style={{ position: 'relative', width: '100%', height: 280 }}>
                <img
                  src={featuredExp.image}
                  alt={featuredExp.name}
                  className="img-mood"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isEnrolled(featuredExp.businessId) ? undefined : 'grayscale(1) brightness(0.85)',
                  }}
                />
                {/* Bottom fade */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  background: 'linear-gradient(to top, rgba(250,248,245,0.6) 0%, rgba(250,248,245,0) 100%)',
                }} />

                {/* Locked overlay */}
                {!isEnrolled(featuredExp.businessId) && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(250,248,245,0.72)',
                    backdropFilter: 'blur(8px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Lock size={22} color="var(--color-muted)" strokeWidth={1.5} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--color-text)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      fontWeight: 400,
                      letterSpacing: '0.2px',
                    }}>
                      Visit {getBusinessName(featuredExp.businessId)} to unlock
                    </span>
                  </div>
                )}

                {/* Featured label */}
                <div style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  backgroundColor: 'rgba(44,24,16,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: 100,
                  padding: '4px 10px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'rgba(250,248,245,0.9)',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}>
                    Featured
                  </span>
                </div>
              </div>

              {/* Featured content */}
              <div style={{ padding: '18px 20px 20px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 24,
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '0.2px',
                }}>
                  {featuredExp.name}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--color-muted)',
                  margin: '6px 0 0',
                  fontWeight: 400,
                }}>
                  {formatDate(featuredExp.date)} · {featuredExp.time}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  margin: '2px 0 0',
                  fontWeight: 300,
                }}>
                  {getBusinessName(featuredExp.businessId)}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    fontWeight: 400,
                    color: '#5DAA68',
                    border: '0.5px solid rgba(93,170,104,0.3)',
                    borderRadius: 100,
                    padding: '3px 9px',
                    letterSpacing: '0.2px',
                  }}>
                    {featuredExp.spotsRemaining} spots left
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    fontWeight: 400,
                    color: 'var(--color-accent)',
                    border: '0.5px solid rgba(139,105,20,0.25)',
                    borderRadius: 100,
                    padding: '3px 9px',
                    letterSpacing: '0.2px',
                  }}>
                    {featuredExp.tierRequired}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          {gridExps.length > 0 && (
            <div style={{ height: '0.5px', backgroundColor: 'var(--color-divider)', marginBottom: 20 }} />
          )}

          {/* 2-Column grid — remaining experiences */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}>
            {gridExps.map((exp, idx) => {
              const enrolled = isEnrolled(exp.businessId);
              const bName = getBusinessName(exp.businessId);
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => enrolled && navigate(`/experience/${exp.id}`)}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-surface)',
                    border: '0.5px solid rgba(44,24,16,0.06)',
                    boxShadow: 'var(--shadow-card)',
                    cursor: enrolled ? 'pointer' : 'default',
                    position: 'relative',
                  }}
                >
                  {/* Image — 160px */}
                  <div style={{ position: 'relative', width: '100%', height: 160 }}>
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="img-mood"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: enrolled ? undefined : 'grayscale(1) brightness(0.85)',
                      }}
                    />
                    {!enrolled && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(250,248,245,0.75)',
                        backdropFilter: 'blur(8px) saturate(1.2)',
                        WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: 12,
                      }}>
                        <Lock size={16} color="var(--color-muted)" strokeWidth={1.5} />
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 10,
                          color: 'var(--color-text)',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          fontWeight: 400,
                          letterSpacing: '0.2px',
                        }}>
                          Visit {bName} to unlock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '10px 12px 12px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      margin: 0,
                      lineHeight: 1.2,
                      letterSpacing: '0.2px',
                    }}>
                      {exp.name}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--color-muted)',
                      margin: '4px 0 0',
                      fontWeight: 400,
                    }}>
                      {formatDate(exp.date)} · {exp.time}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--color-muted)',
                      margin: '1px 0 0',
                      fontWeight: 300,
                    }}>
                      {bName}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        fontWeight: 400,
                        color: 'var(--color-accent)',
                        border: '0.5px solid rgba(139,105,20,0.25)',
                        borderRadius: 100,
                        padding: '2px 7px',
                        letterSpacing: '0.2px',
                      }}>
                        {exp.tierRequired}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: active ? 500 : 400,
        border: '0.5px solid',
        borderColor: active ? 'var(--color-accent)' : 'rgba(44,24,16,0.12)',
        borderRadius: 100,
        padding: '6px 14px',
        backgroundColor: active ? 'rgba(139,105,20,0.06)' : 'transparent',
        color: active ? 'var(--color-accent)' : 'var(--color-text)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px',
      }}
    >
      {label}
    </button>
  );
}
