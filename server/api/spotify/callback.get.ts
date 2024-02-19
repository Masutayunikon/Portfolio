export default defineEventHandler(async (event) => {

    // get event url params from spotify callback

    const query = getQuery(event);

    const runtimeConfig = useRuntimeConfig();

    if (!query) {
        throw createError({
            statusCode: 400,
            message: 'No query string provided'
        });
    }

    if (query.error) {
        throw createError({
            statusCode: 400,
            message: query.error as string
        });
    }

    const code = query.code;
    const state = query.state;


    if (!code || !state) {
        throw createError({
            statusCode: 400,
            message: 'No code or state provided'
        });
    }

    if (state !== runtimeConfig.public.stateSecret) {
        throw createError({
            statusCode: 400,
            message: 'Invalid state'
        });
    }

    const url = new URL('https://accounts.spotify.com/api/token');



    // set header authorization
    const authorization = Buffer.from(`${runtimeConfig.public.spotifyClientId}:${runtimeConfig.public.spotifyClientSecret}`).toString('base64');

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${authorization}`
    };

    const body = new URLSearchParams();

    body.append('grant_type', 'authorization_code');
    body.append('code', code as string);
    body.append('redirect_uri', runtimeConfig.public.spotifyRedirectUri);

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: body.toString()
    });


    if (!response.ok) {
        throw createError({
            statusCode: 400,
            message: 'Failed to get token'
        });
    }

    const data = await response.json();


    const token = data.access_token;
    const refreshToken = data.refresh_token;
    const expiresIn = data.expires_in;

    const expiresAt = Date.now() + (expiresIn * 1000);

    await useStorage().setItem('spotifyToken', token);
    await useStorage().setItem('spotifyRefreshToken', refreshToken);
    await useStorage().setItem('spotifyExpiresAt', expiresAt);

    await sendRedirect(event, 'http://localhost:3000', 302);

});
