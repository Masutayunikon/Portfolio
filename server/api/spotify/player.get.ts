
export default defineEventHandler(async () => {

    let token = await useStorage().getItem('spotifyToken');

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'No token provided'
        });
    }

    // check if token is expired
    const expiresAt = await useStorage().getItem('spotifyExpiresAt');

    if (expiresAt && new Date(expiresAt as number) < new Date()) {
        // refresh token
        const refreshToken = await useStorage().getItem('spotifyRefreshToken');

        if (!refreshToken) {
            throw createError({
                statusCode: 401,
                message: 'No refresh token provided'
            });
        }

        const url = new URL('https://accounts.spotify.com/api/token');

        const runtimeConfig = useRuntimeConfig();

        const body = new URLSearchParams();

        body.append('grant_type', 'refresh_token');
        body.append('refresh_token', refreshToken as string);

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${runtimeConfig.public.spotifyClientId}:${runtimeConfig.public.spotifyClientSecret}`).toString('base64')}`
            },
            body: body.toString()
        });

        if (!response.ok) {
            console.log(await response.json());
            throw createError({
                statusCode: 400,
                message: await response.json()
            });
        }

        const data = await response.json();

        await useStorage().setItem('spotifyToken', data.access_token);
        await useStorage().setItem('spotifyExpiresAt', Date.now() + (data.expires_in * 1000));

        token = data.access_token;
    }

    const url = new URL('https://api.spotify.com/v1/me/player');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    url.searchParams.append('additional_types', 'episode,track');

    const response = await fetch(url.toString(), {
        headers
    });

    if (!response.ok) {
        console.log(await response.json());
        throw createError({
            statusCode: response.status,
            message: await response.json()
        });
    }

    try {
        const data = await response.json();
        console.log(data);
        return {
            recentlyPlayed: false,
            body: data
        }
    } catch (e) {
        // get currently playing track instead
        const url = new URL('https://api.spotify.com/v1/me/player/recently-played');

        url.searchParams.append('additional_types', 'episode,track');

        const response = await fetch(url.toString(), {
            headers
        });

        if (!response.ok) {
            console.log(await response.json(), response.status);
            throw createError({
                statusCode: response.status,
                message: await response.json()
            });
        }

        const data = await response.json();

        return {
            recentlyPlayed: true,
            body: data
        }
    }

});
