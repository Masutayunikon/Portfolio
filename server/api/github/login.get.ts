export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const url = new URL('https://github.com/login/oauth/authorize');

    const scopes = ['user'];

    url.searchParams.append('client_id', runtimeConfig.public.GITHUB_CLIENT_ID);
    url.searchParams.append('redirect_uri', runtimeConfig.public.GITHUB_REDIRECT_URI);
    url.searchParams.append('scope', scopes.join(' '));
    url.searchParams.append('state', runtimeConfig.public.STATE_SECRET);

    await sendRedirect(event, url.toString(), 302);
});
