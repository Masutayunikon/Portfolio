export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const scopes = ['user-read-playback-state', 'user-read-recently-played'];

    const url = new URL('https://accounts.spotify.com/authorize');

    url.searchParams.append('client_id', runtimeConfig.public.spotifyClientId);

    url.searchParams.append('response_type', 'code');

    url.searchParams.append('redirect_uri', runtimeConfig.public.spotifyRedirectUri);

    url.searchParams.append('scope', scopes.join(' '));

    url.searchParams.append('state', runtimeConfig.public.state);

    await sendRedirect(event, url.toString(), 302);

});
