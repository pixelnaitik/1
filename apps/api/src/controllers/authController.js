/**
 * Auth Controller - SecureVoyage API
 * Adheres to API Contract v1 in docs/API_SCHEMA.md
 */

// In-memory store for dev/demo mode
const users = new Map();
const sessions = new Map();

// Seed initial demo user
const demoUser = {
  id: 'usr_demo01',
  email: 'alex.rivers@example.com',
  displayName: 'Alex Rivers',
  passwordHash: 'demo_password_hash',
  role: 'tourist',
  preferences: {
    language: 'en',
    locationConsent: true,
    alertOptIn: true,
    accessibilityMode: false
  },
  createdAt: new Date().toISOString()
};
users.set(demoUser.email.toLowerCase(), demoUser);

export const register = (req, res) => {
  const { email, password, displayName } = req.body || {};

  if (!email || !password || !displayName) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email, password, and display name are required.',
        fields: {
          ...(!email && { email: 'Email is required' }),
          ...(!password && { password: 'Password is required' }),
          ...(!displayName && { displayName: 'Display name is required' })
        }
      }
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({
      error: {
        code: 'EMAIL_EXISTS',
        message: 'An account with this email address already exists.'
      }
    });
  }

  const newUser = {
    id: `usr_${Date.now().toString(36)}`,
    email: normalizedEmail,
    displayName: displayName.trim(),
    passwordHash: 'hashed_' + password,
    role: 'tourist',
    preferences: {
      language: 'en',
      locationConsent: false,
      alertOptIn: true,
      accessibilityMode: false
    },
    createdAt: new Date().toISOString()
  };

  users.set(normalizedEmail, newUser);

  const token = `sv_token_${newUser.id}_${Date.now()}`;
  sessions.set(token, newUser.id);

  const { passwordHash, ...userPayload } = newUser;
  return res.status(201).json({
    user: userPayload,
    accessToken: token
  });
};

export const login = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required.'
      }
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Invalid email or password.'
      }
    });
  }

  const token = `sv_token_${user.id}_${Date.now()}`;
  sessions.set(token, user.id);

  const { passwordHash, ...userPayload } = user;
  return res.status(200).json({
    user: userPayload,
    accessToken: token
  });
};

export const getMe = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = sessions.get(token);

  const user = Array.from(users.values()).find(u => u.id === userId) || demoUser;
  const { passwordHash, ...userPayload } = user;

  return res.status(200).json({ user: userPayload });
};

export const updatePreferences = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = sessions.get(token);

  const user = Array.from(users.values()).find(u => u.id === userId) || demoUser;
  const { language, locationConsent, alertOptIn, accessibilityMode } = req.body || {};

  if (typeof language === 'string') user.preferences.language = language;
  if (typeof locationConsent === 'boolean') user.preferences.locationConsent = locationConsent;
  if (typeof alertOptIn === 'boolean') user.preferences.alertOptIn = alertOptIn;
  if (typeof accessibilityMode === 'boolean') user.preferences.accessibilityMode = accessibilityMode;

  return res.status(200).json({ preferences: user.preferences });
};
