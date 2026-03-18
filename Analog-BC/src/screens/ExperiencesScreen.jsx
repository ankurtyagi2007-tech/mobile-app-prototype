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
        {/* Header */}
        <div style={{ padding: '56px 20px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Experiences
          </h1>
        </div>

        {/* Filter Chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '16px 20px',
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
                  borderRadius: 14,
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-card)',
                  cursor: enrolled ? 'pointer' : 'default',
                  position: 'relative',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: 160 }}>
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
                      backgroundColor: 'rgba(44,24,16,0.55)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: 12,
                    }}>
                      <Lock size={22} color="#FAF7F2" />
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: '#FAF7F2',
                        textAlign: 'center',
                        lineHeight: 1.3,
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
                    fontWeight: 600,
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
                    margin: '4px 0 0',
                  }}>
                    {formatDate(exp.date)} · {exp.time}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--color-muted)',
                    margin: '2px 0 0',
                  }}>
                    {bName}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 500,
                      color: '#FFFFFF',
                      backgroundColor: 'var(--color-sage)',
                      borderRadius: 100,
                      padding: '2px 8px',
                    }}>
                      {exp.spotsRemaining} spots left
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 500,
                      color: 'var(--color-accent)',
                      backgroundColor: 'rgba(196,113,59,0.1)',
                      borderRadius: 100,
                      padding: '2px 8px',
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
        fontWeight: 500,
        border: active ? 'none' : '1px solid var(--color-divider)',
        borderRadius: 100,
        padding: '6px 16px',
        backgroundColor: active ? 'var(--color-accent)' : 'var(--color-surface)',
        color: active ? '#FAF7F2' : 'var(--color-text)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
