export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const url = new URL('https://github.com/login/oauth/authorize');

    const scopes = ['user'];

    url.searchParams.append('client_id', runtimeConfig.public.githubClientId);
    url.searchParams.append('redirect_uri', runtimeConfig.public.githubRedirectUri);
    url.searchParams.append('scope', scopes.join(' '));
    url.searchParams.append('state', runtimeConfig.public.stateSecret);

    await sendRedirect(event, url.toString(), 302);
});
