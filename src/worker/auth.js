import { betterAuth } from 'better-auth'
import { env } from 'cloudflare:workers';


async function savePlayer(user) {
    console.log('savePlayer');
    const { DB } = env;
    const u_id = user.id;

    console.log('saving player...');
    await DB.prepare("INSERT INTO players VALUES(?, 0, null, '0|1|1|1')")
    .bind(u_id)
    .raw()
    console.log('player saved');
    await DB.prepare('INSERT INTO items VALUES (?, 2, 1, 0, 0), (?, 3, 1, 1, 0), (?, 4, 1, 2, 0)')
    .bind(u_id, u_id, u_id)
    .raw()
    console.log('player items saved');
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 1. Generate salt
  const passwordBuffer = encoder.encode(password);

  // 2. Import password
  const key = await crypto.subtle.importKey(
    'raw', passwordBuffer, { name: 'PBKDF2' },
    false, ['deriveBits']
  );

  // 3. Derive bits (hash)
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256 // Length in bits
  );
  
  // Return salt and hash to be stored
  return salt.toHex() + '$' + new Uint8Array(derivedBits).toHex();
}

async function verifyPassword({password, hash}) {
  const storedSalt = Uint8Array.fromHex( hash.slice(0, 32) );
  const storedHash = Uint8Array.fromHex( hash.slice(33) );
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // 1. Import new password
  const key = await crypto.subtle.importKey(
    'raw', passwordBuffer, { name: 'PBKDF2' },
    false, ['deriveBits']
  );

  // 2. Hash it with existing salt
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: storedSalt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  // 3. Constant-time comparison
  const newHash = new Uint8Array(derivedBits);
  return crypto.subtle.timingSafeEqual(storedHash, newHash);
}

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'https://127.0.0.1:5173',
            'https://localhost:5173',
            'https://blasterworld.alexkach99.workers.dev'
        ],
    },
    trustedOrigins: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'https://127.0.0.1:5173',
        'https://localhost:5173',
        'https://blasterworld.alexkach99.workers.dev'
    ],
    database: env.DB,
    databaseHooks: {
        user: {
            create: {
                after: savePlayer,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        password: {
            hash: (password) => hashPassword(password),
            verify: (data) => verifyPassword(data),
        }
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }
    },
})
