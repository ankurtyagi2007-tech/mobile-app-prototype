import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import PageTransition from '../components/PageTransition';
import { useApp } from '../context/AppContext';
import merch from '../data/merch';
import businesses from '../data/businesses';

const rotateKeyframes = `
@keyframes qr-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes qr-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(196,113,59,0.15); }
  50% { box-shadow: 0 0 40px rgba(196,113,59,0.3); }
}
@keyframes qr-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

export default function RedeemScreen() {
  const { businessId, merchId } = useParams();
  const navigate = useNavigate();
  const { currentUser, redeemMerch, redemptions } = useApp();
  const [redeemed, setRedeemed] = useState(false);

  const item = merch.find((m) => m.id === merchId);
  const business = businesses.find((b) => b.id === businessId);
  const enrollment = currentUser.enrollments[businessId];

  if (!item || !business) {
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
          Item not found
        </div>
      </PageTransition>
    );
  }

  const userPoints = enrollment?.points || 0;
  const canAfford = userPoints >= item.pointCost;
  const alreadyRedeemed = !!redemptions[merchId];
  const showQR = redeemed || alreadyRedeemed;

  const handleRedeem = () => {
    redeemMerch(merchId);
    setRedeemed(true);
  };

  const qrValue = `ANALOG-REDEEM-${merchId}-${Date.now()}`;

  return (
    <PageTransition>
      <style>{rotateKeyframes}</style>

      <AnimatePresence mode="wait">
        {!showQR ? (
          <motion.div
            key="pre-redeem"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)' }}
          >
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
                zIndex: 10,
              }}
            >
              <ChevronLeft size={24} color="#FAF7F2" />
            </button>

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                display: 'block',
                borderRadius: '0 0 20px 20px',
              }}
            />

            {/* Details */}
            <div style={{ padding: '24px 20px 120px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 26,
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: 0,
                lineHeight: 1.2,
              }}>
                {item.name}
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-muted)',
                margin: '6px 0 0',
              }}>
                {business.name}
              </p>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'var(--color-text)',
                lineHeight: 1.6,
                margin: '20px 0 0',
              }}>
                {item.description}
              </p>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: 'var(--color-divider)', margin: '24px 0' }} />

              {/* Points */}
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 36,
                fontWeight: 600,
                color: 'var(--color-accent)',
                margin: 0,
                lineHeight: 1,
              }}>
                {item.pointCost} points
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-muted)',
                margin: '8px 0 0',
              }}>
                You have <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{userPoints}</span> points at {business.name}
              </p>
            </div>

            {/* Redeem Button */}
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
                onClick={handleRedeem}
                disabled={!canAfford}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  backgroundColor: canAfford ? 'var(--color-accent)' : 'var(--color-divider)',
                  color: canAfford ? '#FAF7F2' : 'var(--color-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 14,
                  cursor: canAfford ? 'pointer' : 'default',
                }}
              >
                {canAfford ? 'Redeem' : 'Not enough points'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="post-redeem"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              minHeight: '100dvh',
              backgroundColor: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
            }}
          >
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 30,
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
              textAlign: 'center',
            }}>
              Show to Staff
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--color-muted)',
              margin: '6px 0 0',
              textAlign: 'center',
            }}>
              {business.name}
            </p>

            {/* QR Container with animated border */}
            <div style={{
              position: 'relative',
              marginTop: 40,
              width: 240,
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'qr-pulse 2.5s ease-in-out infinite',
              borderRadius: 24,
            }}>
              {/* Rotating gradient border */}
              <div style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 24,
                background: 'conic-gradient(from 0deg, #C4713B, #8B9D77, #FAF7F2, #C4713B)',
                animation: 'qr-rotate 3s linear infinite',
              }} />

              {/* Inner background */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 21,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#2C1810"
                  level="M"
                />
                {/* Shimmer overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  borderRadius: 21,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(105deg, transparent 40%, rgba(196,113,59,0.08) 50%, transparent 60%)',
                    animation: 'qr-shimmer 2s ease-in-out infinite',
                  }} />
                </div>
              </div>
            </div>

            {/* Item name */}
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: '28px 0 0',
              textAlign: 'center',
            }}>
              {item.name}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--color-muted)',
              margin: '8px 0 0',
              textAlign: 'center',
            }}>
              Present this to your barista
            </p>

            {/* Done button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                marginTop: 40,
                padding: '14px 48px',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: 500,
                border: '1.5px solid var(--color-divider)',
                borderRadius: 14,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
