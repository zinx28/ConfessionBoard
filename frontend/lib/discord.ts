/**
 * Convert env discord valujes into discord url
 * @param state 
 */
export function getDiscordAuthUrl(state?: string) {
    const clietnID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUrl = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

    if(!clietnID || !redirectUrl)
    {
        throw new Error("Missing Discord Oauth env vars")
    }

    const params = new URLSearchParams({
        client_id: clietnID,
        response_type: "code",
        redirect_uri: redirectUrl,
        scope: "identify"
    });

    if (state) {
        params.set("state", state)
    }

    return `https://discord.com/oauth2/authorize?${params}`
}

/*
https://discord.com/oauth2/authorize?client_id=1363320877998932209&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcheck%2Flogin&scope=identify&state=board_id=${id}
*/