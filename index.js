const axios = require('axios')
const core = require('@actions/core')

async function main() {
    async function notify() {
        const telegram_bot_token = core.getInput('telegram_bot_token');
        const chat_id = core.getInput('chat_id')
        const SEND_MESSAGE_URL = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;

        const DATA = {chat_id: chat_id, text: "No new commits in the last hour."};
        try {
            await axios.post(SEND_MESSAGE_URL, DATA);
        }
        catch (err) {
            core.setFailed(err.message);
        }
    }

    const URL = 'https://api.github.com/repos/orianshechter/blood-donation-addresses/commits/main'
    const commit = (await axios.get(URL)).data.commit;
    if (new Date(commit.author.date) < Date.now() - 60*60*1000) {
        await notify();
    }
}
main();