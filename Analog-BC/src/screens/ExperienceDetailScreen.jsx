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
            background: 'linear-gradient(to bottom, rgba(44,24,16,0.15) 0%, transparent 30%, rgba(44,24,16,0.6) 100%)',
          }} />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: 52,
              left: 16,
              background: 'rgba(44,24,16,0.3)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: 100,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={24} color="#FAF7F2" />
          </button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          style={{ padding: '24px 20px 120px', marginTop: -32, position: 'relative', zIndex: 2 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {experience.name}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="var(--color-muted)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)' }}>
                {formatDate(experience.date)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--color-muted)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)' }}>
                {experience.time}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="var(--color-muted)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)' }}>
                {business.name}
              </span>
            </div>
          </div>

          {/* Attendees */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
          }}>
            <Users size={16} color="var(--color-accent)" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text)' }}>
              {experience.attendees} going
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-muted)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-sage)', fontWeight: 500 }}>
              {experience.spotsRemaining} spots left
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'var(--color-divider)', margin: '20px 0' }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--color-text)',
            lineHeight: 1.65,
            margin: 0,
          }}>
            {experience.description}
          </p>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'var(--color-divider)', margin: '20px 0' }} />

          {/* Tier Requirement */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: 14,
            backgroundColor: qualifies ? 'rgba(139,157,119,0.08)' : 'var(--color-subtle-bg)',
            borderRadius: 12,
          }}>
            {qualifies ? (
              <CheckCircle size={18} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <Info size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 1 }} />
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
                  margin: '4px 0 0',
                }}>
                  You qualify with your {enrollment.currentTier} status
                </p>
              ) : (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  margin: '4px 0 0',
                }}>
                  {isEnrolled
                    ? `You're currently at ${enrollment.currentTier}. Keep visiting to unlock!`
                    : `Visit ${business.name} to start your journey.`}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* RSVP Button */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-divider)',
          zIndex: 40,
        }}>
          <button
            style={{
              width: '100%',
              padding: '16px 0',
              backgroundColor: qualifies ? 'var(--color-accent)' : 'var(--color-divider)',
              color: qualifies ? '#FAF7F2' : 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              borderRadius: 14,
              cursor: qualifies ? 'pointer' : 'default',
            }}
          >
            Reserve Your Spot
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
