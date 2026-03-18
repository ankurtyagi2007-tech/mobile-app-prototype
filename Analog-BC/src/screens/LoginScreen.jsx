import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

export default function LoginScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/home');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--color-divider)',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <PageTransition>
      <div style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
        {/* Full-bleed background */}
        <img
          src="https://picsum.photos/seed/analog-dining/390/844"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.6) 40%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 24px 40px',
          }}
        >
          {/* Wordmark */}
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 400,
                color: '#FAF7F2',
                letterSpacing: '2px',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Analog
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 300,
                color: 'rgba(250,247,242,0.8)',
                margin: '8px 0 0',
                letterSpacing: '0.5px',
              }}
            >
              Your places are waiting
            </p>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            style={{
              backgroundColor: 'rgba(250,247,242,0.95)',
              borderRadius: '16px',
              padding: '28px 24px',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                marginBottom: '24px',
                backgroundColor: 'var(--color-subtle-bg)',
                borderRadius: '10px',
                padding: '3px',
              }}
            >
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    backgroundColor: mode === m ? 'var(--color-surface)' : 'transparent',
                    color: mode === m ? 'var(--color-text)' : 'var(--color-muted)',
                    boxShadow: mode === m ? '0 1px 4px rgba(44,24,16,0.08)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-divider)')}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-divider)')}
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FAF7F2',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                Continue
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '20px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-divider)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-divider)' }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Google', 'Apple'].map((provider) => (
                <button
                  key={provider}
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid var(--color-divider)',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {provider === 'Google' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/>
                      </svg>
                    )}
                  </span>
                  {provider}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
