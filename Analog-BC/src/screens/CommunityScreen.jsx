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
  Regular: '#C4713B',
  'Daily Grind': '#C4713B',
  Breadwinner: '#C4713B',
  'Inner Circle': '#8B7E74',
  'Inner Crust': '#8B7E74',
  Connoisseur: '#8B7E74',
  "Sommelier's Circle": '#8B7E74',
  'Head Roaster': '#8B7E74',
  'House Guest': '#2C1810',
  'Keeper of the Keys': '#2C1810',
  'Patron Baker': '#2C1810',
  'Grand Cru': '#2C1810',
  staff: '#C4713B',
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
        <div style={{ padding: '56px 20px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Community
          </h1>
        </div>

        {/* Filter Chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '16px 20px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <Chip label="All" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          {enrolledBusinesses.map((b) => (
            <Chip key={b.id} label={b.name} active={activeFilter === b.id} onClick={() => setActiveFilter(b.id)} />
          ))}
        </div>

        {/* Online Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: 100,
            backgroundColor: '#5DAA68',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-muted)' }}>
            {onlineStats.guests} guests · {onlineStats.staff} staff online
          </span>
        </div>

        {/* Pinned Section */}
        {pinnedMessages.length > 0 && (
          <div style={{ margin: '0 20px 12px', borderRadius: 12, backgroundColor: 'var(--color-subtle-bg)', overflow: 'hidden' }}>
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
              <Pin size={14} color="var(--color-accent)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-text)', flex: 1, textAlign: 'left' }}>
                {pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? 's' : ''}
              </span>
              {pinnedExpanded ? <ChevronUp size={16} color="var(--color-muted)" /> : <ChevronDown size={16} color="var(--color-muted)" />}
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
                    <div key={msg.id} style={{ padding: '0 14px 10px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                        {msg.userName}
                      </span>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', margin: '2px 0 0', lineHeight: 1.5 }}>
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Message Feed */}
        <div style={{ padding: '0 20px' }}>
          {feedMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isExpanded={!!expandedReplies[msg.id]}
              onToggleReplies={() => toggleReplies(msg.id)}
              pollVotes={pollVotes}
              votePoll={votePoll}
            />
          ))}
        </div>

        {/* Composer */}
        <div style={{
          position: 'fixed',
          bottom: 60,
          left: 0,
          right: 0,
          padding: '8px 16px',
          paddingBottom: 8,
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-divider)',
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
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-divider)',
              borderRadius: 100,
              padding: '10px 16px',
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
          <button style={{
            width: 38,
            height: 38,
            borderRadius: 100,
            backgroundColor: 'var(--color-accent)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            <Send size={16} color="#FAF7F2" />
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
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 100,
          backgroundColor: avatarBg(msg.userTier),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#FAF7F2',
          fontFamily: 'var(--font-heading)',
          fontSize: 15,
          fontWeight: 600,
        }}>
          {initial(msg.userName)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + tier */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
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
                color: 'var(--color-accent)',
                backgroundColor: 'rgba(196,113,59,0.1)',
                borderRadius: 100,
                padding: '1px 8px',
              }}>
                Staff
              </span>
            )}
          </div>

          {/* Content */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text)',
            margin: '3px 0 0',
            lineHeight: 1.55,
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

          {/* Timestamp */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--color-muted)',
            display: 'block',
            marginTop: 4,
          }}>
            {relativeTime(msg.timestamp)}
          </span>

          {/* Replies toggle */}
          {msg.replies && msg.replies.length > 0 && (
            <>
              <button
                onClick={onToggleReplies}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  padding: '4px 0 0',
                }}
              >
                {isExpanded ? 'Hide replies' : `View ${msg.replies.length} repl${msg.replies.length === 1 ? 'y' : 'ies'}`}
              </button>

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
                          gap: 8,
                          marginTop: 10,
                          paddingLeft: 12,
                          borderLeft: '2px solid var(--color-divider)',
                        }}
                      >
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: 100,
                          backgroundColor: avatarBg(reply.userTier),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#FAF7F2',
                          fontFamily: 'var(--font-heading)',
                          fontSize: 12,
                          fontWeight: 600,
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
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', margin: '2px 0 0', lineHeight: 1.5 }}>
                            {reply.content}
                          </p>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-muted)' }}>
                            {relativeTime(reply.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
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
      marginTop: 10,
      padding: 12,
      backgroundColor: 'var(--color-surface)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-card)',
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 600,
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
              padding: '9px 12px',
              marginBottom: i < poll.options.length - 1 ? 6 : 0,
              borderRadius: 8,
              border: hasVoted ? 'none' : '1px solid var(--color-divider)',
              backgroundColor: hasVoted ? 'var(--color-subtle-bg)' : 'transparent',
              cursor: hasVoted ? 'default' : 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
              fontFamily: 'var(--font-body)',
            }}
          >
            {/* Fill bar */}
            {hasVoted && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${pct}%`,
                backgroundColor: isSelected ? 'rgba(196,113,59,0.18)' : 'rgba(196,113,59,0.08)',
                borderRadius: 8,
                transition: 'width 0.4s ease',
              }} />
            )}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 13,
                color: 'var(--color-text)',
                fontWeight: isSelected ? 600 : 400,
              }}>
                {opt.text}
              </span>
              {hasVoted && (
                <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 500, marginLeft: 8, flexShrink: 0 }}>
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}

      {hasVoted && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-muted)', margin: '8px 0 0' }}>
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
        fontSize: 13,
        fontWeight: 500,
        border: active ? 'none' : '1px solid var(--color-divider)',
        borderRadius: 100,
        padding: '6px 16px',
        backgroundColor: active ? 'var(--color-accent)' : 'var(--color-surface)',
        color: active ? '#FAF7F2' : 'var(--color-text)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
