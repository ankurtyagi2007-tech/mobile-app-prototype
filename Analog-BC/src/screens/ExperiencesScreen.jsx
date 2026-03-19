import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
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

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: 80 }}>
        {/* Header — refined */}
        <div style={{ padding: '60px 20px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: 0,
            letterSpacing: '0.5px',
          }}>
            Experiences
          </h1>
        </div>

        {/* Filter Chips — subtle treatment */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '18px 20px',
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

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          padding: '0 20px 24px',
        }}>
          {filtered.map((exp) => {
            const enrolled = isEnrolled(exp.businessId);
            const bName = getBusinessName(exp.businessId);
            return (
              <div
                key={exp.id}
                onClick={() => enrolled && navigate(`/experience/${exp.id}`)}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: '0 1px 8px rgba(44,24,16,0.04)',
                  cursor: enrolled ? 'pointer' : 'default',
                  position: 'relative',
                }}
              >
                {/* Image — larger */}
                <div style={{ position: 'relative', width: '100%', height: 180 }}>
                  <img
                    src={exp.image}
                    alt={exp.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: enrolled ? undefined : 'grayscale(1) blur(1px)',
                    }}
                  />
                  {!enrolled && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(250,247,242,0.75)',
                      backdropFilter: 'blur(8px) saturate(1.2)',
                      WebkitBackdropFilter: 'blur(8px) saturate(1.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: 12,
                    }}>
                      <Lock size={20} color="var(--color-muted)" strokeWidth={1.5} />
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
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
                <div style={{ padding: '12px 14px 14px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: 0,
                    lineHeight: 1.25,
                  }}>
                    {exp.name}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--color-muted)',
                    margin: '5px 0 0',
                    fontWeight: 300,
                  }}>
                    {formatDate(exp.date)} · {exp.time}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--color-muted)',
                    margin: '2px 0 0',
                    fontWeight: 300,
                  }}>
                    {bName}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 400,
                      color: 'var(--color-sage)',
                      border: '0.5px solid rgba(139,157,119,0.3)',
                      borderRadius: 100,
                      padding: '3px 8px',
                      letterSpacing: '0.2px',
                    }}>
                      {exp.spotsRemaining} spots left
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 400,
                      color: 'var(--color-accent)',
                      border: '0.5px solid rgba(196,113,59,0.25)',
                      borderRadius: 100,
                      padding: '3px 8px',
                      letterSpacing: '0.2px',
                    }}>
                      {exp.tierRequired}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        border: '0.5px solid',
        borderColor: active ? 'var(--color-accent)' : 'rgba(44,24,16,0.1)',
        borderRadius: 100,
        padding: '7px 16px',
        backgroundColor: active ? 'rgba(196,113,59,0.06)' : 'transparent',
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
