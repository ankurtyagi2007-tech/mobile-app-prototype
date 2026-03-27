const user = {
  id: "current-user",
  name: "Alex Chen",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
  memberSince: "2025-07-15",
  enrollments: {
    "ember-oak": {
      enrolled: true,
      currentTier: "Inner Circle",
      tierIndex: 2,
      visits: 22,
      points: 1840,
      nextUnlock: "House Guest at 30 visits",
    },
    "the-copper-still": {
      enrolled: true,
      currentTier: "Regular",
      tierIndex: 1,
      visits: 8,
      points: 640,
      nextUnlock: "Connoisseur at 15 visits",
    },
    "morning-ritual": {
      enrolled: true,
      currentTier: "First Visit",
      tierIndex: 0,
      visits: 2,
      points: 120,
      nextUnlock: "Daily Grind at 5 visits",
    },
    "hearth-honey": {
      enrolled: true,
      currentTier: "Breadwinner",
      tierIndex: 1,
      visits: 12,
      points: 780,
      nextUnlock: "Inner Crust at 15 visits",
    },
    "terroir": {
      enrolled: true,
      currentTier: "Regular",
      tierIndex: 1,
      visits: 6,
      points: 420,
      nextUnlock: "Sommelier's Circle at 15 visits",
    },
  },
};

export default user;
