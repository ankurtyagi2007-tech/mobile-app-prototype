import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronRight, CreditCard, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import businesses from '../data/businesses';
import PageTransition from '../components/PageTransition';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const enrolledBusinesses = businesses.filter(
    (b) => currentUser.enrollments[b.id]?.enrolled
  );

  const totalVisits = Object.values(currentUser.enrollments)
    .filter((e) => e.enrolled)
    .reduce((sum, e) => sum + e.visits, 0);

  const totalPoints = Object.values(currentUser.enrollments)
    .filter((e) => e.enrolled)
    .reduce((sum, e) => sum + e.points, 0);

  const memberDate = new Date(currentUser.memberSince);
  const memberSinceText = memberDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const settingsItems = [
    { icon: CreditCard, label: 'Payment Information' },
    { icon: Bell, label: 'Notification Preferences' },
    { icon: Settings, label: 'Account Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: 48 }}>

        {/* Top bar — close button top-right, subtle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '56px 20px 0',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'rgba(245,240,235,0.7)',
              border: '0.5px solid rgba(44,24,16,0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={15} color="var(--color-text)" strokeWidth={1.5} />
          </button>
        </div>

        {/* Avatar + Name — center aligned, generous vertical spacing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '28px 20px 40px',
          }}
        >
          {/* Avatar — 80px */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid rgba(44,24,16,0.1)',
            marginBottom: 18,
          }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Name — 28px Cormorant, centered */}
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: '0 0 6px',
            letterSpacing: '0.4px',
            textAlign: 'center',
          }}>
            {currentUser.name}
          </h2>

          {/* Member since — 13px Plus Jakarta Sans, muted, centered */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-muted)',
            margin: 0,
            fontWeight: 300,
            letterSpacing: '0.3px',
            textAlign: 'center',
          }}>
            Member since {memberSinceText}
          </p>
        </motion.div>

        {/* Stats row — three columns, centered, stat numbers 28px Cormorant */}
        <div style={{ padding: '0 20px 40px' }}>
          <div style={{
            display: 'flex',
            gap: '1px',
            backgroundColor: 'rgba(44,24,16,0.04)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {[
              { value: totalVisits, label: 'Total Visits' },
              { value: totalPoints.toLocaleString(), label: 'Total Points' },
              { value: enrolledBusinesses.length, label: 'Places' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '22px 8px',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                {/* Stat number — 28px Cormorant */}
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 28,
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  margin: '0 0 5px',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </p>
                {/* Stat label — 10px uppercase Plus Jakarta Sans */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--color-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 300,
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '0 20px', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* Your Places — 22px Cormorant title */}
        <div style={{ padding: '32px 20px 0' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: '0 0 16px',
            letterSpacing: '0.4px',
          }}>
            Your Places
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {enrolledBusinesses.map((business, index) => {
              const enrollment = currentUser.enrollments[business.id];
              return (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                  onClick={() => navigate(`/business/${business.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 16,
                    backgroundColor: 'var(--color-surface)',
                    border: '0.5px solid rgba(44,24,16,0.06)',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-card)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Thumbnail — 48px */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    <img
                      src={business.thumbnailImage}
                      alt={business.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 16,
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      margin: '0 0 3px',
                    }}>
                      {business.name}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--color-muted)',
                      margin: 0,
                      fontWeight: 300,
                    }}>
                      {enrollment.currentTier} &middot; {enrollment.visits} visits
                    </p>
                  </div>
                  <ChevronRight size={15} color="rgba(44,24,16,0.2)" strokeWidth={1.5} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '32px 20px 0', height: '0.5px', backgroundColor: 'var(--color-divider)' }} />

        {/* Settings — 14px, thin dividers, chevron icons */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '0.5px solid rgba(44,24,16,0.06)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>
            {settingsItems.map(({ icon: Icon, label }, index) => (
              <button
                key={label}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '17px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: index < settingsItems.length - 1 ? '0.5px solid rgba(44,24,16,0.05)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={16} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--color-text)',
                  fontWeight: 400,
                }}>
                  {label}
                </span>
                <ChevronRight size={13} color="rgba(44,24,16,0.2)" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out — outlined, centered, #8B6914 text */}
        <div style={{ padding: '24px 20px 0' }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px',
              backgroundColor: 'transparent',
              border: '0.5px solid rgba(139,105,20,0.3)',
              borderRadius: 100,
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} color="#8B6914" strokeWidth={1.5} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              color: '#8B6914',
              letterSpacing: '0.2px',
            }}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
