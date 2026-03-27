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

  // Split into two columns for true masonry with varied heights
  const leftCol = [];
  const rightCol = [];
  filtered.forEach((exp, i) => {
    if (i % 3 === 0) leftCol.push(exp);      // every 3rd to left (gets taller cards)
    else if (i % 3 === 1) rightCol.push(exp); // to right
    else leftCol.push(exp);                    // overflow to left
  });

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

        {/* Masonry Layout — two columns with varied card heights */}
        <div style={{ padding: '28px 16px 24px', display: 'flex', gap: 12 }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leftCol.map((exp, idx) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={idx}
                // Alternate: tall, compact, tall, compact...
                variant={idx % 2 === 0 ? 'tall' : 'compact'}
                isEnrolled={isEnrolled(exp.businessId)}
                businessName={getBusinessName(exp.businessId)}
                formatDate={formatDate}
                onClick={() => isEnrolled(exp.businessId) && navigate(`/experience/${exp.id}`)}
              />
            ))}
          </div>

          {/* Right column — offset down for stagger */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40 }}>
            {rightCol.map((exp, idx) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={idx + leftCol.length}
                // Opposite pattern: compact, tall, compact, tall...
                variant={idx % 2 === 0 ? 'compact' : 'tall'}
                isEnrolled={isEnrolled(exp.businessId)}
                businessName={getBusinessName(exp.businessId)}
                formatDate={formatDate}
                onClick={() => isEnrolled(exp.businessId) && navigate(`/experience/${exp.id}`)}
              />
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
}

function ExperienceCard({ exp, index, variant, isEnrolled: enrolled, businessName, formatDate, onClick }) {
  const isTall = variant === 'tall';
  const imgHeight = isTall ? 220 : 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={onClick}
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        border: '0.5px solid rgba(44,24,16,0.06)',
        boxShadow: 'var(--shadow-card)',
        cursor: enrolled ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: imgHeight }}>
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

        {/* Locked overlay */}
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
              Visit {businessName} to unlock
            </span>
          </div>
        )}

        {/* Spots left badge — tall cards only */}
        {isTall && enrolled && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(44,24,16,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 100,
            padding: '3px 9px',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 500,
              color: 'rgba(250,248,245,0.9)',
              letterSpacing: '0.5px',
            }}>
              {exp.spotsRemaining} left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: isTall ? '14px 14px 16px' : '10px 12px 12px' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isTall ? 18 : 15,
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
          {businessName}
        </p>

        {/* Tier pill */}
        <div style={{ marginTop: 8 }}>
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
