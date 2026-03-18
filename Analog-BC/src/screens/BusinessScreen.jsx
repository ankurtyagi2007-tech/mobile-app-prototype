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
        {/* Hero */}
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img
            src={`https://picsum.photos/seed/${business.imageSeed}/390/300`}
            alt={business.name}
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
              background: 'linear-gradient(to top, rgba(44,24,16,0.8) 0%, transparent 50%)',
            }}
          />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(44,24,16,0.4)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <ChevronLeft size={22} color="#FAF7F2" />
          </button>

          {/* Hero text */}
          <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
                fontWeight: 600,
                color: '#FAF7F2',
                margin: '0 0 4px',
                lineHeight: 1.15,
              }}
            >
              {business.name}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(250,247,242,0.7)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {business.category}
            </p>
          </div>
        </div>

        {/* Current Tier Card */}
        {enrollment?.enrolled && (
          <div style={{ padding: '20px 20px 0' }}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Recognition
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                    {enrollment.currentTier}
                  </h2>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>
                  {enrollment.visits} visits
                </span>
              </div>

              {/* Progress bar */}
              {nextTier && (
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--color-subtle-bg)',
                      borderRadius: '3px',
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
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '8px 0 0' }}>
                    {nextTier.threshold - enrollment.visits} more visits to {nextTier.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recognition Timeline */}
        <div style={{ padding: '28px 20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 20px' }}>
            Recognition Journey
          </h3>

          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '6px',
                bottom: '6px',
                width: '2px',
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
                    marginBottom: index < business.tiers.length - 1 ? '24px' : 0,
                    padding: isCurrent ? '16px' : '0',
                    backgroundColor: isCurrent ? 'var(--color-subtle-bg)' : 'transparent',
                    borderRadius: isCurrent ? '12px' : 0,
                    marginLeft: isCurrent ? '-8px' : 0,
                    paddingLeft: isCurrent ? '20px' : 0,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: isCurrent ? '-20px' : '-28px',
                      top: isCurrent ? '20px' : '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isReached ? 'var(--color-accent)' : 'transparent',
                      border: isReached ? '3px solid var(--color-accent)' : '2px solid var(--color-divider)',
                      zIndex: 1,
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: isCurrent ? '18px' : '16px',
                        fontWeight: isReached ? 600 : 400,
                        color: isReached ? 'var(--color-text)' : 'var(--color-muted)',
                        margin: '0 0 4px',
                      }}
                    >
                      {tier.name}
                    </h4>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        color: 'var(--color-muted)',
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
                          backgroundColor: isReached ? 'rgba(196,113,59,0.08)' : 'var(--color-subtle-bg)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          opacity: isReached ? 1 : 0.7,
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

        {/* Divider */}
        <div style={{ margin: '28px 20px 0', height: '1px', backgroundColor: 'var(--color-divider)' }} />

        {/* Business Info */}
        <div style={{ padding: '24px 20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
            About
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 20px' }}>
            {business.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: MapPin, text: business.address },
              { icon: Clock, text: business.hours },
              { icon: Phone, text: business.phone },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={16} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '28px 20px 0', height: '1px', backgroundColor: 'var(--color-divider)' }} />

        {/* Merch Section */}
        {businessMerch.length > 0 && (
          <div style={{ padding: '24px 0 0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px', paddingLeft: '20px' }}>
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
                    width: '150px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      marginBottom: '10px',
                      backgroundColor: 'var(--color-subtle-bg)',
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
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-accent)', margin: 0, fontWeight: 500 }}>
                    {item.pointCost} pts
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ margin: '28px 20px 0', height: '1px', backgroundColor: 'var(--color-divider)' }} />

        {/* Events Section */}
        {businessExperiences.length > 0 && (
          <div style={{ padding: '24px 20px 0' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
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
                      borderRadius: '14px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={exp.image}
                      alt={exp.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ padding: '12px 14px 12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px', lineHeight: 1.25 }}>
                        {exp.name}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '0 0 4px' }}>
                        {formattedDate} at {exp.time}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-accent)', margin: 0 }}>
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
        <div style={{ margin: '28px 20px 0', height: '1px', backgroundColor: 'var(--color-divider)' }} />

        {/* Community Preview */}
        <div style={{ padding: '24px 20px 0' }}>
          <button
            onClick={() => navigate('/community')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '14px',
              border: 'none',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageCircle size={20} color="var(--color-accent)" strokeWidth={1.5} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>
                  Join the conversation
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: '2px 0 0' }}>
                  See what others are saying
                </p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-muted)" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
