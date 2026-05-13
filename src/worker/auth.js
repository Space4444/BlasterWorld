import { betterAuth } from 'better-auth'
import { env } from 'cloudflare:workers';


function savePlayer(user) {
    console.log('savePlayer');
    const { DB } = env;
    const u_id = user.id;

    console.log('saving player...');
    DB.prepare("INSERT INTO players VALUES(?, 0, null, '0|1|1|1')")
    .bind(u_id)
    .raw()
    .then(res => {
        console.log('player saved');
    }, err => {
        console.log('player saving error:', err);
    })
    .catch(err => {
        console.log('player saving error 2:', err);
    })
    .finally(() => {
        console.log('player saving finished');
    });
    DB.prepare('INSERT INTO items VALUES (?, 2, 1, 0, 0), (?, 3, 1, 1, 0), (?, 4, 1, 2, 0)')
    .bind(u_id, u_id, u_id)
    .run()
    .then(res => {
        console.log('player items saved');
    }, err => {
        console.log('player items saving error:', err);
    })
    .catch(err => {
        console.log('player items saving error 2:', err);
    })
    .finally(() => {
        console.log('player items saving finished');
    });;
}


export const auth = betterAuth({
    baseURL: 'http://127.0.0.1:5173',
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
    },
//   socialProviders: {
//     github: {
//       clientId: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//     },
//     google: {
//       clientId: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//     },
//   },
})
