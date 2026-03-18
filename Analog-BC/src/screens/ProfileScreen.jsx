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
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Profile
          </h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-subtle-bg)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color="var(--color-text)" strokeWidth={1.5} />
          </button>
        </div>

        {/* User section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 20px 28px',
          }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--color-divider)',
              marginBottom: '14px',
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
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 4px',
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
            }}
          >
            Member since {memberSinceText}
          </p>
        </motion.div>

        {/* Overall stats */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              display: 'flex',
              gap: '12px',
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
                  padding: '18px 8px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    margin: '0 0 2px',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--color-muted)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Places */}
        <div style={{ padding: '0 20px 24px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '0 0 14px',
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
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-card)',
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
                      src={`https://picsum.photos/seed/${business.imageSeed}/96/96`}
                      alt={business.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 2px' }}>
                      {business.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', margin: 0 }}>
                      {enrollment.currentTier} &middot; {enrollment.visits} visits
                    </p>
                  </div>
                  <ChevronRight size={18} color="var(--color-muted)" strokeWidth={1.5} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '0 20px', height: '1px', backgroundColor: 'var(--color-divider)' }} />

        {/* Settings */}
        <div style={{ padding: '24px 20px 0' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-card)',
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
                  padding: '16px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: index < settingsItems.length - 1 ? '1px solid var(--color-divider)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} color="var(--color-muted)" strokeWidth={1.5} />
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text)' }}>
                  {label}
                </span>
                <ChevronRight size={16} color="var(--color-divider)" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out */}
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
              border: '1px solid var(--color-accent)',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} color="var(--color-accent)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500, color: 'var(--color-accent)' }}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
