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

    const getHtmlUrl = async (url: string) => {
        const data = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        const json = await data.json()


        return json.html_url || json.url
    }

    for (const event of data) {
        if (event.payload.commits) {
            event.href = await getHtmlUrl(event.payload.commits[0].url)
        } else if (event.payload.pull_request) {
            event.href = event.payload.pull_request.html_url
        } else if (event.repo && event.repo.url) {
            event.href = await getHtmlUrl(event.repo.url)
        } else if (event.payload.issue) {
            event.href = event.payload.issue.html_url
        } else if (event.payload.comment) {
            event.href = event.payload.comment.html_url
        }
    }

    return {
        body: data
    }

});
