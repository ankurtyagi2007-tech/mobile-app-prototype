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
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: '48px' }}>

        {/* Hero — full-bleed, 380px tall, no border-radius */}
        <div style={{ position: 'relative', height: '380px', overflow: 'hidden', flexShrink: 0 }}>
          <div className="grain" style={{ position: 'absolute', inset: 0 }}>
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
          </div>

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                to top,
                rgba(36,20,12,0.88) 0%,
                rgba(36,20,12,0.45) 40%,
                rgba(36,20,12,0.1) 65%,
                transparent 100%
              )`,
            }}
          />

          {/* Back button — frosted glass circle */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '52px',
              left: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(250,248,245,0.15)',
              backdropFilter: 'blur(16px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
              border: '0.5px solid rgba(250,248,245,0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <ChevronLeft size={20} color="#FAF8F5" strokeWidth={1.5} />
          </button>

          {/* Hero text — category + venue name at bottom */}
          <div style={{ position: 'absolute', bottom: '28px', left: '24px', right: '24px' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(250,248,245,0.55)',
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 400,
              }}
            >
              {business.category}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '40px',
                fontWeight: 500,
                color: '#FAF8F5',
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: '0.3px',
              }}
            >
              {business.name}
            </h1>
          </div>
        </div>

        {/* Recognition Card — white surface, 0.5px border, 24px padding */}
        {enrollment?.enrolled && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            style={{ padding: '32px 20px 0' }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '18px',
                padding: '24px',
                border: '0.5px solid rgba(44,24,16,0.06)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* YOUR RECOGNITION label */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--color-muted)',
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 400,
                }}
              >
                Your Recognition
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                {/* Tier name — 28px Cormorant */}
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {enrollment.currentTier}
                </h2>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 300,
                    color: 'var(--color-muted)',
                  }}
                >
                  {enrollment.visits} visits
                </span>
              </div>

              {/* Progress bar — 3px thin, #8B6914 fill, #F5F0EB track */}
              {nextTier && (
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '3px',
                      backgroundColor: '#F5F0EB',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                      style={{
                        height: '100%',
                        backgroundColor: '#8B6914',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--color-muted)',
                      margin: '10px 0 0',
                      fontWeight: 300,
                    }}
                  >
                    {nextTier.threshold - enrollment.visits} more visits to {nextTier.name}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <div style={{ margin: '40px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* Recognition Journey — section title 24px Cormorant */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          style={{ padding: '32px 20px 0' }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: '0 0 24px',
            }}
          >
            Recognition Journey
          </h3>

          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical line — 0.5px */}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '6px',
                bottom: '6px',
                width: '0.5px',
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
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  style={{
                    position: 'relative',
                    marginBottom: index < business.tiers.length - 1 ? '28px' : 0,
                    padding: isCurrent ? '18px' : '0',
                    backgroundColor: isCurrent ? 'rgba(245,240,235,0.6)' : 'transparent',
                    borderRadius: isCurrent ? '14px' : 0,
                    marginLeft: isCurrent ? '-8px' : 0,
                    paddingLeft: isCurrent ? '22px' : 0,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: isCurrent ? '-20px' : '-28px',
                      top: isCurrent ? '22px' : '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isReached ? '#8B6914' : 'transparent',
                      border: isReached ? 'none' : '1px solid var(--color-divider)',
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
                          backgroundColor: isReached ? 'rgba(139,105,20,0.06)' : 'rgba(245,240,235,0.6)',
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
        </motion.div>

        {/* Divider */}
        <div style={{ margin: '40px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          style={{ padding: '32px 20px 0' }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: '0 0 16px',
            }}
          >
            About
          </h3>
          {/* About text — 14px Plus Jakarta Sans, line-height 1.7 */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontWeight: 300,
            }}
          >
            {business.description}
          </p>

          {/* Address/hours/phone — 13px, with subtle icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: MapPin, text: business.address },
              { icon: Clock, text: business.hours },
              { icon: Phone, text: business.phone },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Icon size={14} color="var(--color-muted)" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--color-text)',
                    fontWeight: 300,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ margin: '40px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* Merch Section — horizontal scroll, clean minimal cards */}
        {businessMerch.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            style={{ padding: '32px 0 0' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: '0 0 20px',
                paddingLeft: '20px',
              }}
            >
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
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {businessMerch.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/redeem/${id}/${item.id}`)}
                  style={{
                    flexShrink: 0,
                    width: '155px',
                    cursor: 'pointer',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '0.5px solid rgba(44,24,16,0.06)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div
                    style={{
                      width: '155px',
                      height: '140px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-subtle-bg)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '12px 12px 14px' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--color-text)',
                        margin: '0 0 4px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        color: 'var(--color-accent)',
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {item.pointCost} pts
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        {businessExperiences.length > 0 && (
          <div style={{ margin: '40px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />
        )}

        {/* Upcoming Experiences */}
        {businessExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            style={{ padding: '32px 20px 0' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: '0 0 20px',
              }}
            >
              Upcoming at {business.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {businessExperiences.map((exp, index) => {
                const dateObj = new Date(exp.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/experience/${exp.id}`)}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '0.5px solid rgba(44,24,16,0.06)',
                      boxShadow: 'var(--shadow-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={exp.image}
                      alt={exp.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0, display: 'block' }}
                    />
                    <div style={{ padding: '14px 14px 14px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '16px',
                          fontWeight: 500,
                          color: 'var(--color-text)',
                          margin: '0 0 4px',
                          lineHeight: 1.25,
                        }}
                      >
                        {exp.name}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          color: 'var(--color-muted)',
                          margin: '0 0 4px',
                          fontWeight: 300,
                        }}
                      >
                        {formattedDate} at {exp.time}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          color: 'var(--color-accent)',
                          margin: 0,
                          fontWeight: 400,
                        }}
                      >
                        {exp.spotsRemaining} spots left
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <div style={{ margin: '40px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* Community Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          style={{ padding: '32px 20px 0' }}
        >
          <button
            onClick={() => navigate('/community')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '14px',
              border: '0.5px solid rgba(44,24,16,0.06)',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <MessageCircle size={18} color="var(--color-accent)" strokeWidth={1.5} />
              <div style={{ textAlign: 'left' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  Join the conversation
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--color-muted)',
                    margin: '3px 0 0',
                    fontWeight: 300,
                  }}
                >
                  See what others are saying
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-muted)" strokeWidth={1.5} />
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
