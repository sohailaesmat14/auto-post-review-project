const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is running 24/7!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server is up!'));

const token = '8515771718:AAGQap1M4c5djwgt9Mgzh7Lfuxfv-EAnFAw';
const chatId = '1123943230';
const bot = new TelegramBot(token, {polling: false});

const targets = [
    { 
        name: 'ITI English', 
        url: 'https://www.facebook.com/groups/1616488856986681', 
        selector: 'div[role="article"]',
        lastPost: '' 
    },
    { 
        name: 'ITI',
        url: 'https://www.facebook.com/ITI.eg', 
        selector: 'div[role="article"]',
        lastPost: '' 
    },
    { 
        name: 'Eh_El_Moshkla', 
        url: 'https://www.youtube.com/@Eh_El_Moshkla/videos', 
        selector: '#video-title', 
        lastPost: '' 
    },
    { 
        name: 'amgad_samir', 
        url: 'https://www.youtube.com/@amgad_samir/videos', 
        selector: '#video-title', 
        lastPost: '' 
    },
    { 
        name: 'Fahem Podcast', 
        url: 'https://www.youtube.com/@Fahem.Podcast/videos', 
        selector: '#video-title', 
        lastPost: '' 
    }
];

async function scrapeAndNotify() {
    console.log('Checking all pages and channels...');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    try {
        for (let target of targets) {
            console.log(`Checking ${target.name}...`);
            await page.goto(target.url, { waitUntil: 'networkidle2' });

            const latestContent = await page.evaluate((sel) => {
                const elements = document.querySelectorAll(sel);
                if (elements.length > 1) {
                    return elements[1].innerText;
                } 
                else if (elements.length === 1) {
                    return elements[0].innerText;
                }
                return null;
            }, target.selector);

            if (latestContent && latestContent !== target.lastPost) {
                target.lastPost = latestContent;
                bot.sendMessage(chatId, `🚀 New content from ${target.name}!\n\n${latestContent}\n\nLink: ${target.url}`);
                console.log(`Notification sent for ${target.name}!`);
            } else {
                console.log(`No new content in ${target.name}.`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

setInterval(scrapeAndNotify, 900000);
scrapeAndNotify();