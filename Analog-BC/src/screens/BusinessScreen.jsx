import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Clock, Phone, ChevronRight, MessageCircle } from 'lucide-react';
import businesses from '../data/businesses';
import merch from '../data/merch';
import experiences from '../data/experiences';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

export default function BusinessScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const business = businesses.find((b) => b.id === id);
  const enrollment = currentUser.enrollments[id];
  const businessMerch = merch.filter((m) => m.businessId === id);
  const businessExperiences = experiences.filter((e) => e.businessId === id);

  if (!business) {
    return (
      <PageTransition>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>Business not found</div>
      </PageTransition>
    );
  }

  const currentTierIndex = enrollment?.enrolled ? enrollment.tierIndex : -1;
  const nextTier = business.tiers[currentTierIndex + 1];
  const progressToNext = nextTier
    ? ((enrollment?.visits || 0) / nextTier.threshold) * 100
    : 100;

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: '40px' }}>
        {/* Hero — taller, more editorial */}
        <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
          <img
            src={business.heroImage}
            alt={business.name}
            className="img-mood"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                to top,
                rgba(36,20,12,0.85) 0%,
                rgba(36,20,12,0.4) 40%,
                rgba(36,20,12,0.1) 65%,
                transparent 100%
              )`,
            }}
          />

          {/* Back button — refined */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '52px',
              left: '16px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(250,247,242,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '0.5px solid rgba(250,247,242,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <ChevronLeft size={20} color="#FAF7F2" strokeWidth={1.5} />
          </button>

          {/* Hero text — editorial */}
          <div style={{ position: 'absolute', bottom: '28px', left: '24px', right: '24px' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(250,247,242,0.5)',
                margin: '0 0 6px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {business.category}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                fontWeight: 500,
                color: '#FAF7F2',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '0.5px',
              }}
            >
              {business.name}
            </h1>
          </div>
        </div>

        {/* Current Tier Card — refined */}
        {enrollment?.enrolled && (
          <div style={{ padding: '24px 20px 0' }}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 1px 12px rgba(44,24,16,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-muted)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 400 }}>
                    Your Recognition
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>
                    {enrollment.currentTier}
                  </h2>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: 'var(--color-muted)' }}>
                  {enrollment.visits} visits
                </span>
              </div>

              {/* Progress bar — thinner, refined */}
              {nextTier && (
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'var(--color-subtle-bg)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--color-accent)',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '10px 0 0', fontWeight: 300 }}>
                    {nextTier.threshold - enrollment.visits} more visits to {nextTier.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recognition Timeline — sophisticated */}
        <div style={{ padding: '32px 20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 24px' }}>
            Recognition Journey
          </h3>

          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical line — thinner */}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '6px',
                bottom: '6px',
                width: '1px',
                backgroundColor: 'var(--color-divider)',
              }}
            />

            {business.tiers.map((tier, index) => {
              const isReached = index <= currentTierIndex;
              const isCurrent = index === currentTierIndex;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{
                    position: 'relative',
                    marginBottom: index < business.tiers.length - 1 ? '28px' : 0,
                    padding: isCurrent ? '18px' : '0',
                    backgroundColor: isCurrent ? 'rgba(243,237,229,0.6)' : 'transparent',
                    borderRadius: isCurrent ? '14px' : 0,
                    marginLeft: isCurrent ? '-8px' : 0,
                    paddingLeft: isCurrent ? '22px' : 0,
                  }}
                >
                  {/* Dot — thin ring for unreached, filled for reached */}
                  <div
                    style={{
                      position: 'absolute',
                      left: isCurrent ? '-20px' : '-28px',
                      top: isCurrent ? '22px' : '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isReached ? 'var(--color-accent)' : 'transparent',
                      border: isReached ? 'none' : '1.5px solid var(--color-divider)',
                      zIndex: 1,
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: isCurrent ? '19px' : '17px',
                        fontWeight: isReached ? 500 : 400,
                        color: isReached ? 'var(--color-text)' : 'var(--color-muted)',
                        margin: '0 0 6px',
                      }}
                    >
                      {tier.name}
                    </h4>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: 'var(--color-muted)',
                        fontWeight: 300,
                      }}
                    >
                      {tier.threshold === 0 ? 'Start' : `${tier.threshold} visits`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {tier.perks.map((perk) => (
                      <span
                        key={perk}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '11px',
                          color: isReached ? 'var(--color-text)' : 'var(--color-muted)',
                          backgroundColor: isReached ? 'rgba(196,113,59,0.06)' : 'rgba(243,237,229,0.6)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          opacity: isReached ? 1 : 0.6,
                          fontWeight: 400,
                        }}
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider — thinner */}
        <div style={{ margin: '32px 20px 0', height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)' }} />

        {/* Business Info — more breathing room */}
        <div style={{ padding: '28px 20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 18px' }}>
            About
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 24px', fontWeight: 300 }}>
            {business.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: MapPin, text: business.address },
              { icon: Clock, text: business.hours },
              { icon: Phone, text: business.phone },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Icon size={15} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text)', fontWeight: 300 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '32px 20px 0', height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)' }} />

        {/* Merch Section — polished cards */}
        {businessMerch.length > 0 && (
          <div style={{ padding: '28px 0 0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 18px', paddingLeft: '20px' }}>
              Available to You
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '14px',
                overflowX: 'auto',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
            >
              {businessMerch.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  onClick={() => navigate(`/redeem/${id}/${item.id}`)}
                  style={{
                    flexShrink: 0,
                    width: '155px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '155px',
                      height: '155px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      marginBottom: '10px',
                      backgroundColor: 'var(--color-subtle-bg)',
                      boxShadow: '0 2px 12px rgba(44,24,16,0.06)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {item.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-accent)', margin: 0, fontWeight: 400 }}>
                    {item.pointCost} pts
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ margin: '32px 20px 0', height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)' }} />

        {/* Events Section — cleaner card design */}
        {businessExperiences.length > 0 && (
          <div style={{ padding: '28px 20px 0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 18px' }}>
              Upcoming at {business.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {businessExperiences.map((exp, index) => {
                const dateObj = new Date(exp.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => navigate(`/experience/${exp.id}`)}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 8px rgba(44,24,16,0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={exp.image}
                      alt={exp.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ padding: '14px 14px 14px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 4px', lineHeight: 1.25 }}>
                        {exp.name}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '0 0 4px', fontWeight: 300 }}>
                        {formattedDate} at {exp.time}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-accent)', margin: 0, fontWeight: 400 }}>
                        {exp.spotsRemaining} spots left
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ margin: '32px 20px 0', height: '0.5px', backgroundColor: 'rgba(44,24,16,0.08)' }} />

        {/* Community Preview — refined */}
        <div style={{ padding: '28px 20px 0' }}>
          <button
            onClick={() => navigate('/community')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 1px 8px rgba(44,24,16,0.04)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <MessageCircle size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>
                  Join the conversation
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '3px 0 0', fontWeight: 300 }}>
                  See what others are saying
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-muted)" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
