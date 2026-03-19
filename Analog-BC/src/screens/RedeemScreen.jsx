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
  0%, 100% { box-shadow: 0 0 24px rgba(139,105,20,0.1); }
  50% { box-shadow: 0 0 48px rgba(139,105,20,0.22); }
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
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            color: 'var(--color-text)',
          }}
        >
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
            {/* Product image — full-bleed, 340px, no border-radius */}
            <div
              className="grain"
              style={{
                position: 'relative',
                width: '100%',
                height: '340px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="img-mood"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Bottom gradient on image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(to top, var(--color-bg) 0%, rgba(250,248,245,0) 100%)',
                }}
              />
            </div>

            {/* Back button — frosted glass circle, positioned over image */}
            <button
              onClick={() => navigate(-1)}
              style={{
                position: 'absolute',
                top: '52px',
                left: '16px',
                background: 'rgba(250,248,245,0.15)',
                backdropFilter: 'blur(16px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                border: '0.5px solid rgba(250,248,245,0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <ChevronLeft size={20} color="#FAF8F5" strokeWidth={1.5} />
            </button>

            {/* Details */}
            <div style={{ padding: '20px 20px 120px' }}>
              {/* Product name — 28px Cormorant */}
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '0.3px',
                }}
              >
                {item.name}
              </h1>

              {/* Venue name — 13px Plus Jakarta Sans, muted */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-muted)',
                  margin: '6px 0 0',
                  fontWeight: 300,
                }}
              >
                {business.name}
              </p>

              {/* Description — 14px, line-height 1.7 */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  lineHeight: 1.7,
                  margin: '24px 0 0',
                  fontWeight: 300,
                }}
              >
                {item.description}
              </p>

              {/* Divider */}
              <div style={{ height: '0.5px', backgroundColor: 'var(--color-divider)', margin: '28px 0' }} />

              {/* Point cost — 40px Cormorant, #8B6914 */}
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '40px',
                  fontWeight: 500,
                  color: '#8B6914',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '0.5px',
                }}
              >
                {item.pointCost} points
              </p>

              {/* "You have X points" — 13px */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-muted)',
                  margin: '10px 0 0',
                  fontWeight: 300,
                }}
              >
                You have{' '}
                <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{userPoints}</span>{' '}
                points at {business.name}
              </p>
            </div>

            {/* Redeem button — fixed bottom bar */}
            <div
              style={{
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
              }}
            >
              {/* Redeem button — #8B6914, rounded-full, full-width */}
              <button
                onClick={handleRedeem}
                disabled={!canAfford}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  backgroundColor: canAfford ? '#8B6914' : 'rgba(44,24,16,0.06)',
                  color: canAfford ? '#FAF8F5' : 'var(--color-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '100px',
                  cursor: canAfford ? 'pointer' : 'default',
                  boxShadow: canAfford ? '0 2px 16px rgba(139,105,20,0.25)' : 'none',
                  letterSpacing: '0.3px',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {canAfford ? 'Redeem' : 'Not enough points'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* QR Code state — centered, generous whitespace */
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
              padding: '48px 20px',
            }}
          >
            {/* "Show to Staff" — 28px Cormorant */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: 0,
                textAlign: 'center',
                letterSpacing: '0.5px',
              }}
            >
              Show to Staff
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-muted)',
                margin: '10px 0 0',
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              {business.name}
            </p>

            {/* QR container with animated brass border */}
            <div
              style={{
                position: 'relative',
                marginTop: '48px',
                width: '240px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'qr-pulse 2.5s ease-in-out infinite',
                borderRadius: '24px',
              }}
            >
              {/* Rotating gradient border — brass palette */}
              <div
                style={{
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '26px',
                  background: 'conic-gradient(from 0deg, #8B6914, #C4B87A, #FAF8F5, #8B6914)',
                  animation: 'qr-rotate 3s linear infinite',
                }}
              />

              {/* Inner white background */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '22px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#2C1810"
                  level="M"
                />
                {/* Shimmer overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    borderRadius: '22px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(105deg, transparent 40%, rgba(139,105,20,0.07) 50%, transparent 60%)',
                      animation: 'qr-shimmer 2s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Item name */}
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 500,
                color: 'var(--color-text)',
                margin: '36px 0 0',
                textAlign: 'center',
                letterSpacing: '0.3px',
              }}
            >
              {item.name}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-muted)',
                margin: '8px 0 0',
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              Present this to your barista
            </p>

            {/* Done button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                marginTop: '48px',
                padding: '14px 48px',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                border: '0.5px solid rgba(44,24,16,0.15)',
                borderRadius: '100px',
                cursor: 'pointer',
                letterSpacing: '0.3px',
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
