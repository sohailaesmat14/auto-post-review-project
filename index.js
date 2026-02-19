const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
const dataFile = 'last_posts.json';

let savedData = {};
if (fs.existsSync(dataFile)) {
    savedData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

const targets = [
    { name: 'ITI English', url: 'https://www.facebook.com/groups/1616488856986681', selector: 'div[role="article"]' },
    { name: 'ITI', url: 'https://www.facebook.com/ITI.eg', selector: 'div[role="article"]' },
    { name: 'Eh_El_Moshkla', url: 'https://www.youtube.com/@Eh_El_Moshkla/videos', selector: '#video-title' },
    { name: 'amgad_samir', url: 'https://www.youtube.com/@amgad_samir/videos', selector: '#video-title' },
    { name: 'Fahem Podcast', url: 'https://www.youtube.com/@Fahem.Podcast/videos', selector: '#video-title' }
];

async function run() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    for (let target of targets) {
        try {
            await page.goto(target.url, { waitUntil: 'networkidle2' });
            const latestContent = await page.evaluate((sel) => {
                const elements = document.querySelectorAll(sel);
                if (elements.length > 1) return elements[1].innerText;
                if (elements.length === 1) return elements[0].innerText;
                return null;
            }, target.selector);

            if (latestContent && latestContent !== savedData[target.name]) {
                savedData[target.name] = latestContent;
                const message = `🚀 New content from ${target.name}!\n\n${latestContent}\n\nLink: ${target.url}`;
                await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                    chat_id: chatId,
                    text: message
                });
            }
        } catch (error) {
            console.error(`Error in ${target.name}:`, error.message);
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(savedData, null, 2));
    await browser.close();
}

run();
