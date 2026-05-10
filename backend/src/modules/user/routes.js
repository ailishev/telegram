import {Router} from 'express';
import prisma from '../../lib/prisma.js';
import {authMiddleware} from '../../middleware/auth.js';
import {env} from '../../config/env.js';

const router = Router();

function buildProfileDefaults(user) {
  const p = user?.profile || {};
  const username = (typeof p.username === 'string' && p.username.trim()) ? p.username.trim() : null;
  return {
    firstName: p.firstName || null,
    lastName: p.lastName || null,
    username,
    usernames: Array.isArray(p.usernames) ? p.usernames : [],
    bio: p.bio || null,
    birthday: p.birthday || null,
    location: p.location || null,
    businessHours: p.businessHours || null,
    businessLocation: p.businessLocation || null,
    link: p.link || null,
    contactNote: p.contactNote || null,
    savedMusic: p.savedMusic || null,
    stories: p.stories || [],
    pinnedGifts: p.pinnedGifts || [],
    avatarUrl: p.avatarUrl || null,
    status: p.status || null,
    verified: typeof p.verified === 'boolean' ? p.verified : false,
    isPremium: typeof p.isPremium === 'boolean' ? p.isPremium : false,
    premiumUntil: p.premiumUntil || null,
    lastSeen: p.lastSeen || null,
    phoneNumber: p.phoneNumber || user.phone || null
  };
}

async function ensureProfileCompleteness(userId) {
  return prisma.user.findUnique({
    where: {id: userId},
    include: {profile: true, gifts: true}
  });
}

function toPlainProfile(user) {
  const p = user?.profile || {};
  const usernames = Array.isArray(p.usernames) ? p.usernames.filter((it) => typeof it === 'string' && it.trim()) : [];
  const username = (typeof p.username === 'string' && p.username.trim()) ? p.username.trim() : (usernames[0] || '');
  return {
    id: user.id,
    phone: user.phone || null,
    email: user.email || null,
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    username,
    usernames: usernames.length ? usernames : (username ? [username] : []),
    bio: p.bio || '',
    birthday: p.birthday || null,
    location: p.location || null,
    businessHours: p.businessHours || null,
    businessLocation: p.businessLocation || null,
    link: p.link || '',
    contactNote: p.contactNote || '',
    savedMusic: p.savedMusic || null,
    stories: Array.isArray(p.stories) ? p.stories : [],
    pinnedGifts: Array.isArray(p.pinnedGifts) ? p.pinnedGifts : [],
    avatar: p.avatarUrl || '',
    status: p.status || '',
    verified: !!(p.verified || p.isVerified),
    lastSeen: p.lastSeen || null,
    isPremium: !!p.isPremium,
    premiumUntil: p.premiumUntil || null,
    phoneNumber: p.phoneNumber || user.phone || null
  };
}

router.get('/me', authMiddleware, async(req, res) => {
  const user = await ensureProfileCompleteness(req.user.id);
  if(!user) {
    return res.status(404).json({error: 'Not found'});
  }
  const p = user.profile;
  const profile = toPlainProfile(user);
  res.json({
    ...user,
    profileData: profile,
    gifts: user.gifts || [],
    summary: {
      id: user.id,
      username: (p?.username && String(p.username).trim()) || '',
      avatar: p?.avatarUrl || '',
      status: p?.status || '',
      verified: !!p?.verified,
      isPremium: !!p?.isPremium,
      premiumUntil: p?.premiumUntil || null,
      storiesCount: Array.isArray(p?.stories) ? p.stories.length : 0,
      giftsCount: Array.isArray(user.gifts) ? user.gifts.length : 0
    }
  });
});

/** Same as /me but always includes fresh profile (for UI bootstrap). */
router.get('/me/full', authMiddleware, async(req, res) => {
  const user = await ensureProfileCompleteness(req.user.id);
  if(!user) {
    return res.status(404).json({error: 'Not found'});
  }
  res.json({...user, profileData: toPlainProfile(user), gifts: user.gifts || []});
});

/** Profile bundle for Telegram UI (`users.getFullUser` adapter). */
router.get('/:id/full', authMiddleware, async(req, res) => {
  const user = await ensureProfileCompleteness(req.params.id);
  if(!user) return res.status(404).json({error: 'User not found'});
  res.json({...user, profileData: toPlainProfile(user), gifts: user.gifts || []});
});

router.get('/:id', authMiddleware, async(req, res) => {
  const user = await ensureProfileCompleteness(req.params.id);
  if(!user) return res.status(404).json({error: 'User not found'});
  res.json({...user, profileData: toPlainProfile(user), gifts: user.gifts || []});
});

router.post('/me/avatar', authMiddleware, async(req, res) => {
  const {dataUrl} = req.body || {};
  if(typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({error: 'dataUrl image is required'});
  }
  if(!env.cloudinaryCloudName || !env.cloudinaryUploadPreset) {
    return res.status(500).json({error: 'Cloudinary is not configured'});
  }

  const form = new URLSearchParams();
  form.set('file', dataUrl);
  form.set('upload_preset', env.cloudinaryUploadPreset);
  form.set('folder', 'tweb/avatars');

  const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`, {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: form.toString()
  });
  const cloudinaryJson = await cloudinaryRes.json().catch(() => ({}));
  const avatarUrl = typeof cloudinaryJson?.secure_url === 'string' ? cloudinaryJson.secure_url : '';
  if(!cloudinaryRes.ok || !avatarUrl) {
    return res.status(502).json({error: cloudinaryJson?.error?.message || 'Cloudinary upload failed'});
  }

  await prisma.profile.upsert({
    where: {userId: req.user.id},
    create: {userId: req.user.id, avatarUrl},
    update: {avatarUrl}
  });

  const user = await ensureProfileCompleteness(req.user.id);
  res.json({ok: true, avatarUrl, user: user ? {...user, profileData: toPlainProfile(user)} : null});
});

export default router;
