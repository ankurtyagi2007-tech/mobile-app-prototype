import { useState, useMemo } from 'react';
import { Pin, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import community from '../data/community';
import businesses from '../data/businesses';

const tierColors = {
  'First Visit': '#8B9D77',
  'First Pour': '#8B9D77',
  'First Taste': '#8B9D77',
  'First Glass': '#8B9D77',
  Regular: '#8B6914',
  'Daily Grind': '#8B6914',
  Breadwinner: '#8B6914',
  'Inner Circle': '#8B7E74',
  'Inner Crust': '#8B7E74',
  Connoisseur: '#8B7E74',
  "Sommelier's Circle": '#8B7E74',
  'Head Roaster': '#8B7E74',
  'House Guest': '#2C1810',
  'Keeper of the Keys': '#2C1810',
  'Patron Baker': '#2C1810',
  'Grand Cru': '#2C1810',
  staff: '#8B6914',
};

function avatarBg(tier) {
  return tierColors[tier] || 'var(--color-muted)';
}

function initial(name) {
  return name.replace(/^Owner:\s*/, '').charAt(0).toUpperCase();
}

function relativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommunityScreen() {
  const { currentUser, pollVotes, votePoll } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [pinnedExpanded, setPinnedExpanded] = useState(false);

  const enrolledBusinesses = useMemo(
    () => businesses.filter((b) => currentUser.enrollments[b.id]?.enrolled),
    [currentUser]
  );

  const selectedIds = useMemo(
    () => (activeFilter === 'all' ? enrolledBusinesses.map((b) => b.id) : [activeFilter]),
    [activeFilter, enrolledBusinesses]
  );

  const allMessages = useMemo(() => {
    const msgs = [];
    selectedIds.forEach((bid) => {
      const bData = community[bid];
      if (bData) {
        bData.messages.forEach((m) => msgs.push({ ...m, _businessId: bid }));
      }
    });
    msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return msgs;
  }, [selectedIds]);

  const pinnedMessages = useMemo(() => allMessages.filter((m) => m.isPinned), [allMessages]);
  const feedMessages = useMemo(() => allMessages.filter((m) => !m.isPinned), [allMessages]);

  const onlineStats = useMemo(() => {
    let guests = 0;
    let staff = 0;
    selectedIds.forEach((bid) => {
      const bData = community[bid];
      if (bData) {
        guests += bData.guestsOnline;
        staff += bData.businessUsersOnline;
      }
    });
    return { guests, staff };
  }, [selectedIds]);

  const toggleReplies = (msgId) =>
    setExpandedReplies((p) => ({ ...p, [msgId]: !p[msgId] }));

  return (
    <PageTransition>
      <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-bg)', paddingBottom: 140 }}>

        {/* Header */}
        <div style={{ padding: '60px 20px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 48,
            fontWeight: 500,
            color: 'var(--color-text)',
            margin: 0,
            letterSpacing: '0.3px',
            lineHeight: 1.05,
          }}>
            Community
          </h1>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '20px 20px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <Chip label="All" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          {enrolledBusinesses.map((b) => (
            <Chip key={b.id} label={b.name} active={activeFilter === b.id} onClick={() => setActiveFilter(b.id)} />
          ))}
        </div>

        {/* Online indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 20px' }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: 100,
            backgroundColor: '#5DAA68',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-muted)',
            fontWeight: 300,
            letterSpacing: '0.2px',
          }}>
            {onlineStats.guests} guests · {onlineStats.staff} staff online
          </span>
        </div>

        {/* Pinned Section — subtle, collapsed */}
        {pinnedMessages.length > 0 && (
          <div style={{
            margin: '0 20px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(245,240,235,0.6)',
            overflow: 'hidden',
            border: '0.5px solid rgba(44,24,16,0.06)',
          }}>
            <button
              onClick={() => setPinnedExpanded(!pinnedExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Pin size={12} color="var(--color-accent)" strokeWidth={1.5} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--color-text)',
                flex: 1,
                textAlign: 'left',
                letterSpacing: '0.2px',
              }}>
                {pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? 's' : ''}
              </span>
              {pinnedExpanded
                ? <ChevronUp size={13} color="var(--color-muted)" strokeWidth={1.5} />
                : <ChevronDown size={13} color="var(--color-muted)" strokeWidth={1.5} />}
            </button>
            <AnimatePresence>
              {pinnedExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  {pinnedMessages.slice(0, 2).map((msg) => (
                    <div key={msg.id} style={{ padding: '0 14px 12px' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--color-text)',
                      }}>
                        {msg.userName}
                      </span>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-text)',
                        margin: '2px 0 0',
                        lineHeight: 1.5,
                        fontWeight: 300,
                      }}>
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Message Feed — 16px gap between posts */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {feedMessages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx < 5 ? idx * 0.06 : 0 }}
            >
              <MessageBubble
                msg={msg}
                isExpanded={!!expandedReplies[msg.id]}
                onToggleReplies={() => toggleReplies(msg.id)}
                pollVotes={pollVotes}
                votePoll={votePoll}
              />
            </motion.div>
          ))}
        </div>

        {/* Composer — thin border, minimal */}
        <div style={{
          position: 'fixed',
          bottom: 60,
          left: 0,
          right: 0,
          padding: '10px 16px',
          paddingBottom: 10,
          background: 'rgba(250,248,245,0.94)',
          backdropFilter: 'blur(20px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
          borderTop: '0.5px solid var(--color-divider)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 45,
        }}>
          <input
            type="text"
            placeholder="Share something..."
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              backgroundColor: 'rgba(255,255,255,0.75)',
              border: '0.5px solid rgba(44,24,16,0.1)',
              borderRadius: 100,
              padding: '10px 18px',
              color: 'var(--color-text)',
              outline: 'none',
              fontWeight: 300,
            }}
          />
          <button style={{
            width: 36,
            height: 36,
            borderRadius: 100,
            backgroundColor: '#8B6914',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(139,105,20,0.22)',
          }}>
            <Send size={14} color="#FAF8F5" strokeWidth={1.5} />
          </button>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  );
}

function MessageBubble({ msg, isExpanded, onToggleReplies, pollVotes, votePoll }) {
  const hasVoted = pollVotes[msg.id] !== undefined;
  const isStaff = msg.userTier === 'staff';

  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      border: '0.5px solid rgba(44,24,16,0.06)',
      borderRadius: 12,
      padding: 24,
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Avatar — 40px */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          border: `1.5px solid ${avatarBg(msg.userTier)}`,
          backgroundColor: 'rgba(250,248,245,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: avatarBg(msg.userTier),
          fontFamily: 'var(--font-heading)',
          fontSize: 16,
          fontWeight: 500,
        }}>
          {initial(msg.userName)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--color-text)',
            }}>
              {msg.userName}
            </span>
            {!isStaff && (
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 11,
                fontStyle: 'italic',
                color: 'var(--color-muted)',
              }}>
                {msg.userTier}
              </span>
            )}
            {isStaff && (
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 500,
                color: '#8B6914',
                border: '0.5px solid rgba(139,105,20,0.22)',
                borderRadius: 100,
                padding: '1px 8px',
                letterSpacing: '0.3px',
              }}>
                Staff
              </span>
            )}
          </div>

          {/* Post text */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text)',
            margin: '6px 0 0',
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            {msg.content}
          </p>

          {/* Poll */}
          {msg.poll && (
            <PollWidget
              poll={msg.poll}
              msgId={msg.id}
              hasVoted={hasVoted}
              votedIndex={pollVotes[msg.id]}
              onVote={votePoll}
            />
          )}

          {/* Timestamp + Reply */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-muted)',
              fontWeight: 300,
            }}>
              {relativeTime(msg.timestamp)}
            </span>

            {/* Replies toggle — 13px #8B6914 */}
            {msg.replies && msg.replies.length > 0 && (
              <button
                onClick={onToggleReplies}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#8B6914',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {isExpanded
                  ? 'Hide replies'
                  : `View ${msg.replies.length} repl${msg.replies.length === 1 ? 'y' : 'ies'}`}
              </button>
            )}
          </div>

          {/* Replies thread */}
          {msg.replies && msg.replies.length > 0 && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  {msg.replies.map((reply) => (
                    <div
                      key={reply.id}
                      style={{
                        display: 'flex',
                        gap: 10,
                        marginTop: 14,
                        paddingLeft: 14,
                        borderLeft: '1px solid rgba(44,24,16,0.08)',
                      }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 100,
                        border: `1px solid ${avatarBg(reply.userTier)}`,
                        backgroundColor: 'rgba(250,248,245,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: avatarBg(reply.userTier),
                        fontFamily: 'var(--font-heading)',
                        fontSize: 12,
                        fontWeight: 500,
                      }}>
                        {initial(reply.userName)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                            {reply.userName}
                          </span>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontStyle: 'italic', color: 'var(--color-muted)' }}>
                            {reply.userTier}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', margin: '3px 0 0', lineHeight: 1.5, fontWeight: 300 }}>
                          {reply.content}
                        </p>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-muted)', fontWeight: 300 }}>
                          {relativeTime(reply.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function PollWidget({ poll, msgId, hasVoted, votedIndex, onVote }) {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div style={{
      marginTop: 12,
      padding: '14px 16px',
      backgroundColor: 'rgba(245,240,235,0.5)',
      borderRadius: 10,
      border: '0.5px solid rgba(44,24,16,0.06)',
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--color-text)',
        margin: '0 0 10px',
      }}>
        {poll.question}
      </p>

      {poll.options.map((opt, i) => {
        const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
        const isSelected = votedIndex === i;

        return (
          <button
            key={i}
            onClick={() => !hasVoted && onVote(msgId, i)}
            disabled={hasVoted}
            style={{
              display: 'block',
              width: '100%',
              position: 'relative',
              padding: '10px 12px',
              marginBottom: i < poll.options.length - 1 ? 6 : 0,
              borderRadius: 8,
              border: hasVoted
                ? `0.5px solid ${isSelected ? 'rgba(139,105,20,0.3)' : 'rgba(44,24,16,0.06)'}`
                : '0.5px solid rgba(44,24,16,0.1)',
              backgroundColor: hasVoted ? 'rgba(250,248,245,0.7)' : 'transparent',
              cursor: hasVoted ? 'default' : 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
              fontFamily: 'var(--font-body)',
            }}
          >
            {/* Progress fill */}
            {hasVoted && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${pct}%`,
                backgroundColor: isSelected ? 'rgba(139,105,20,0.10)' : 'rgba(139,105,20,0.04)',
                borderRadius: 8,
                transition: 'width 0.4s ease',
              }} />
            )}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 13,
                color: 'var(--color-text)',
                fontWeight: isSelected ? 500 : 300,
              }}>
                {opt.text}
              </span>
              {hasVoted && (
                <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 400, marginLeft: 8, flexShrink: 0 }}>
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}

      {hasVoted && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-muted)', margin: '10px 0 0', fontWeight: 300 }}>
          {totalVotes} votes
        </p>
      )}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: active ? 500 : 400,
        border: '0.5px solid',
        borderColor: active ? 'var(--color-accent)' : 'rgba(44,24,16,0.12)',
        borderRadius: 100,
        padding: '6px 14px',
        backgroundColor: active ? 'rgba(139,105,20,0.06)' : 'transparent',
        color: active ? 'var(--color-accent)' : 'var(--color-text)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px',
      }}
    >
      {label}
    </button>
  );
}
