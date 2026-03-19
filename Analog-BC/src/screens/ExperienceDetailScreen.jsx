import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, Users, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useApp } from '../context/AppContext';
import experiences from '../data/experiences';
import businesses from '../data/businesses';

export default function ExperienceDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const experience = experiences.find((e) => e.id === id);
  const business = experience
    ? businesses.find((b) => b.id === experience.businessId)
    : null;

  if (!experience || !business) {
    return (
      <PageTransition>
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          color: 'var(--color-text)',
        }}>
          Experience not found
        </div>
      </PageTransition>
    );
  }

  const enrollment = currentUser.enrollments[business.id];
  const isEnrolled = enrollment?.enrolled;

  const userTierIndex = isEnrolled ? (enrollment.tierIndex ?? 0) : -1;
  const requiredTier = business.tiers.find((t) => t.name === experience.tierRequired);
  const requiredTierIndex = requiredTier
    ? business.tiers.indexOf(requiredTier)
    : 0;
  const qualifies = userTierIndex >= requiredTierIndex;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', position: 'relative' }}>

        {/* Hero Image — full-bleed, 340px, no border-radius */}
        <div className="grain" style={{ position: 'relative', width: '100%', height: 340 }}>
          <img
            src={experience.image}
            alt={experience.name}
            className="img-mood"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Gradient overlay — bottom fade to bg */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(44,24,16,0.12) 0%, transparent 35%, rgba(250,248,245,1) 100%)',
          }} />

          {/* Back button — frosted glass */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: 52,
              left: 16,
              background: 'rgba(250,248,245,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '0.5px solid rgba(250,248,245,0.25)',
              borderRadius: 100,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} color="#FAF8F5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content — pulls up over the gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          style={{ padding: '0 20px 120px', marginTop: -40, position: 'relative', zIndex: 2 }}
        >
          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '0.3px',
          }}>
            {experience.name}
          </h1>

          {/* Meta details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <MetaRow icon={<Calendar size={14} color="var(--color-muted)" strokeWidth={1.5} />}>
              {formatDate(experience.date)}
            </MetaRow>
            <MetaRow icon={<Clock size={14} color="var(--color-muted)" strokeWidth={1.5} />}>
              {experience.time}
            </MetaRow>
            <MetaRow icon={<MapPin size={14} color="var(--color-muted)" strokeWidth={1.5} />}>
              {business.name}
            </MetaRow>
          </div>

          {/* Attendees row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 16,
          }}>
            <Users size={14} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', fontWeight: 400 }}>
              {experience.attendees} going
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-muted)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5DAA68', fontWeight: 500 }}>
              {experience.spotsRemaining} spots left
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '0.5px', backgroundColor: 'var(--color-divider)', margin: '28px 0' }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text)',
            lineHeight: 1.7,
            margin: 0,
            fontWeight: 300,
          }}>
            {experience.description}
          </p>

          {/* Divider */}
          <div style={{ height: '0.5px', backgroundColor: 'var(--color-divider)', margin: '28px 0' }} />

          {/* Tier Requirement card */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '16px 18px',
            backgroundColor: qualifies ? 'rgba(93,170,104,0.05)' : 'rgba(245,240,235,0.7)',
            borderRadius: 12,
            border: '0.5px solid',
            borderColor: qualifies ? 'rgba(93,170,104,0.18)' : 'rgba(44,24,16,0.06)',
          }}>
            {qualifies ? (
              <CheckCircle size={16} color="#5DAA68" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
            ) : (
              <Info size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
            )}
            <div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: 0,
              }}>
                Requires {experience.tierRequired} status at {business.name}
              </p>
              {qualifies ? (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: '#5DAA68',
                  margin: '5px 0 0',
                  fontWeight: 400,
                }}>
                  You qualify with your {enrollment.currentTier} status
                </p>
              ) : (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  margin: '5px 0 0',
                  fontWeight: 300,
                }}>
                  {isEnrolled
                    ? `You're currently at ${enrollment.currentTier}. Keep visiting to unlock!`
                    : `Visit ${business.name} to start your journey.`}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reserve Button — fixed bottom */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'rgba(250,248,245,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '0.5px solid var(--color-divider)',
          zIndex: 40,
        }}>
          <button
            style={{
              width: '100%',
              padding: '16px 0',
              backgroundColor: qualifies ? '#8B6914' : 'rgba(44,24,16,0.06)',
              color: qualifies ? '#FAF8F5' : 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              border: 'none',
              borderRadius: 100,
              cursor: qualifies ? 'pointer' : 'default',
              boxShadow: qualifies ? '0 2px 16px rgba(139,105,20,0.22)' : 'none',
              letterSpacing: '0.3px',
              transition: 'background 0.2s',
            }}
          >
            Reserve Your Spot
          </button>
        </div>
      </div>
    </PageTransition>
  );
}

function MetaRow({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon}
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-muted)',
        fontWeight: 300,
      }}>
        {children}
      </span>
    </div>
  );
}
