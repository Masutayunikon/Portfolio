export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const scopes = ['user-read-playback-state', 'user-read-recently-played'];

    const url = new URL('https://accounts.spotify.com/authorize');

    url.searchParams.append('client_id', runtimeConfig.public.SPOTIFY_CLIENT_ID);

    url.searchParams.append('response_type', 'code');

    url.searchParams.append('redirect_uri', runtimeConfig.public.SPOTIFY_REDIRECT_URI);

    url.searchParams.append('scope', scopes.join(' '));

    url.searchParams.append('state', runtimeConfig.public.STATE_SECRET);

    await sendRedirect(event, url.toString(), 302);

});
