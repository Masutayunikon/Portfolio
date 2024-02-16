export default defineEventHandler(async () => {

    if (!(await useStorage().getItem('githubUsername'))) {
        const url = new URL('https://api.github.com/user');

        const token = await useStorage().getItem('githubToken');

        if (!token) {
            throw createError({
                statusCode: 401,
                message: 'No token provided'
            });
        }

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw createError({
                statusCode: 400,
                message: await response.json()
            });
        }

        const data = await response.json();

        await useStorage().setItem('githubUsername', data.login);
    }


    // get events of the github user

    const url = new URL('https://api.github.com/users/' + (await useStorage().getItem('githubUsername')) + '/events');

    // add per_page query
    url.searchParams.append('per_page', '10');

    const token = await useStorage().getItem('githubToken');

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'No token provided'
        });
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw createError({
            statusCode: 400,
            message: await response.json()
        });
    }

    const data = await response.json();

    return {
        body: data
    }

});
