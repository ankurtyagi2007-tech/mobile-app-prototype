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
        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '60dvh' }}>
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
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(36,20,12,0.15) 0%, transparent 30%, rgba(36,20,12,0.55) 100%)',
          }} />

          {/* Back button — refined */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: 52,
              left: 16,
              background: 'rgba(250,247,242,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '0.5px solid rgba(250,247,242,0.2)',
              borderRadius: 100,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} color="#FAF7F2" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          style={{ padding: '28px 20px 120px', marginTop: -32, position: 'relative', zIndex: 2 }}
        >
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

          {/* Meta — airy spacing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={15} color="var(--color-muted)" strokeWidth={1.5} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)', fontWeight: 300 }}>
                {formatDate(experience.date)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={15} color="var(--color-muted)" strokeWidth={1.5} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)', fontWeight: 300 }}>
                {experience.time}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={15} color="var(--color-muted)" strokeWidth={1.5} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)', fontWeight: 300 }}>
                {business.name}
              </span>
            </div>
          </div>

          {/* Attendees */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
          }}>
            <Users size={15} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text)', fontWeight: 400 }}>
              {experience.attendees} going
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-divider)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-sage)', fontWeight: 500 }}>
              {experience.spotsRemaining} spots left
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)', margin: '24px 0' }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--color-text)',
            lineHeight: 1.7,
            margin: 0,
            fontWeight: 300,
          }}>
            {experience.description}
          </p>

          {/* Divider */}
          <div style={{ height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)', margin: '24px 0' }} />

          {/* Tier Requirement — refined card */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: 16,
            backgroundColor: qualifies ? 'rgba(139,157,119,0.06)' : 'rgba(243,237,229,0.5)',
            borderRadius: 14,
            border: '0.5px solid',
            borderColor: qualifies ? 'rgba(139,157,119,0.15)' : 'rgba(44,24,16,0.05)',
          }}>
            {qualifies ? (
              <CheckCircle size={17} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={1.5} />
            ) : (
              <Info size={17} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={1.5} />
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
                  color: 'var(--color-sage)',
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

        {/* RSVP Button — refined with glass */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          background: 'rgba(250,247,242,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '0.5px solid rgba(44,24,16,0.06)',
          zIndex: 40,
        }}>
          <button
            style={{
              width: '100%',
              padding: '16px 0',
              backgroundColor: qualifies ? 'var(--color-accent)' : 'var(--color-divider)',
              color: qualifies ? '#FAF7F2' : 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              border: 'none',
              borderRadius: 14,
              cursor: qualifies ? 'pointer' : 'default',
              boxShadow: qualifies ? '0 2px 12px rgba(196,113,59,0.2)' : 'none',
              letterSpacing: '0.3px',
            }}
          >
            Reserve Your Spot
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
