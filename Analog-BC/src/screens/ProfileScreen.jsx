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
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: '40px' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: 0,
              letterSpacing: '0.5px',
            }}
          >
            Profile
          </h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(243,237,229,0.6)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color="var(--color-text)" strokeWidth={1.5} />
          </button>
        </div>

        {/* User section — editorial, larger avatar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 20px 32px',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid rgba(44,24,16,0.1)',
              marginBottom: '16px',
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: '0 0 5px',
              letterSpacing: '0.5px',
            }}
          >
            {currentUser.name}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-muted)',
              margin: 0,
              fontWeight: 300,
              letterSpacing: '0.3px',
            }}
          >
            Member since {memberSinceText}
          </p>
        </motion.div>

        {/* Overall stats — more visual weight on numbers */}
        <div style={{ padding: '0 20px 28px' }}>
          <div
            style={{
              display: 'flex',
              gap: '1px',
              backgroundColor: 'rgba(44,24,16,0.04)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
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
                  padding: '20px 8px',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    margin: '0 0 4px',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    color: 'var(--color-muted)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 300,
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Places — use thumbnailImage */}
        <div style={{ padding: '0 20px 28px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: '0 0 16px',
              letterSpacing: '0.5px',
            }}
          >
            Your Places
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    gap: '14px',
                    padding: '16px',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '16px',
                    boxShadow: '0 1px 8px rgba(44,24,16,0.04)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={business.thumbnailImage}
                      alt={business.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', margin: '0 0 3px' }}>
                      {business.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: 0, fontWeight: 300 }}>
                      {enrollment.currentTier} &middot; {enrollment.visits} visits
                    </p>
                  </div>
                  <ChevronRight size={16} color="var(--color-divider)" strokeWidth={1.5} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider — thinner */}
        <div style={{ margin: '0 20px', height: '0.5px', backgroundColor: 'rgba(44,24,16,0.06)' }} />

        {/* Settings — more padding, thinner dividers */}
        <div style={{ padding: '28px 20px 0' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              boxShadow: '0 1px 8px rgba(44,24,16,0.04)',
              overflow: 'hidden',
            }}
          >
            {settingsItems.map(({ icon: Icon, label }, index) => (
              <button
                key={label}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: index < settingsItems.length - 1 ? '0.5px solid rgba(44,24,16,0.05)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={17} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text)', fontWeight: 400 }}>
                  {label}
                </span>
                <ChevronRight size={14} color="var(--color-divider)" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out — refined */}
        <div style={{ padding: '28px 20px 0' }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '15px',
              backgroundColor: 'transparent',
              border: '0.5px solid rgba(196,113,59,0.3)',
              borderRadius: '14px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--color-accent)' }}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
