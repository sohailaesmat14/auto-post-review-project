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
    { name: 'ITI English', url: 'https://www.facebook.com/groups/1616488856986681', selector: 'div[data-ad-comet-preview="message"]', skipFirst: true },
    { name: 'ITI', url: 'https://www.facebook.com/ITI.eg', selector: 'div[data-ad-comet-preview="message"]', skipFirst: true },
    { name: 'Eh_El_Moshkla', url: 'https://www.youtube.com/@Eh_El_Moshkla/videos', selector: '#video-title', skipFirst: false },
    { name: 'amgad_samir', url: 'https://www.youtube.com/@amgad_samir/videos', selector: '#video-title', skipFirst: false },
    { name: 'Fahem Podcast', url: 'https://www.youtube.com/@Fahem.Podcast/videos', selector: '#video-title', skipFirst: false }
];

async function run() {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    for (let target of targets) {
        try {
            await page.goto(target.url, { waitUntil: 'networkidle2' });
            
            const latestContent = await page.evaluate((sel, skip) => {
                const elements = document.querySelectorAll(sel);
                if (elements.length === 0) return null;
                if (skip && elements.length > 1) {
                    return elements[1].innerText;
                } 
                return elements[0].innerText;
            }, target.selector, target.skipFirst);

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
