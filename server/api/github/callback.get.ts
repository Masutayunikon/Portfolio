export default defineEventHandler(async (event) => {

    const runtimeConfig = useRuntimeConfig();
    const url = new URL('https://github.com/login/oauth/access_token');

    const query = getQuery(event);

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

    if (state !== runtimeConfig.public.state) {
        throw createError({
            statusCode: 400,
            message: 'Invalid state'
        });
    }

    const body = new URLSearchParams();

    body.append('client_id', runtimeConfig.public.githubClientId);
    body.append('client_secret', runtimeConfig.public.githubClientSecret);
    body.append('code', code as string);
    body.append('redirect_uri', runtimeConfig.public.githubRedirectUri);

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: body.toString()
    });

    if (!response.ok) {
        throw createError({
            statusCode: 400,
            message: await response.json()
        });
    }

    const data = await response.json();

    await useStorage().setItem('githubToken', data.access_token);

    await sendRedirect(event, '/', 302);

});
