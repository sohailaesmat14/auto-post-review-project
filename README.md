# 📡 Your Posts of Interest (Telegram Automation Bot)
<img width="2545" height="1536" alt="Gemini_Generated_Image_5vf6el5vf6el5vf6" src="https://github.com/user-attachments/assets/54984526-9423-4233-b774-1cfa088888a9" />

An automated web scraping bot built with Node.js and Puppeteer. This bot acts as a personal radar, monitoring specific Facebook groups, Facebook pages, and YouTube channels. Whenever new content is published, it sends a real-time push notification directly to your Telegram app.

The entire process is automated using **GitHub Actions** to run on a scheduled basis (CRON jobs), making it a 100% serverless and free solution.

## ✨ Key Features

* **Real-time Notifications:** Instantly sends Telegram messages when new posts or videos are detected.
* **Smart Memory System:** Uses a local `last_posts.json` file committed back to the repository after each run to "remember" the last seen posts and strictly avoid sending duplicate alerts.
* **Cookie Injection:** Safely accesses private Facebook groups without storing hardcoded credentials by injecting session cookies.
* **Pinned Post Handler:** Features a dynamic `skipCount` property to intelligently bypass pinned posts on Facebook pages and target the actual latest content.
* **Serverless Automation:** Runs entirely on GitHub Actions, requiring no paid hosting.

## 🛠️ Tech Stack

* **JavaScript (Node.js)**
* **Puppeteer:** For headless browser automation and web scraping.
* **Axios:** For making HTTP requests to the Telegram Bot API.
* **GitHub Actions:** For CI/CD and cron job scheduling.

## 🚀 How It Works Under the Hood

1. **GitHub Actions** triggers the `scraper.yml` workflow every 30 minutes.
2. **Puppeteer** launches a headless Chrome browser, injects Facebook cookies (if provided), and visits the targeted URLs.
3. The bot evaluates the DOM using specific CSS selectors (e.g., `div[data-ad-comet-preview="message"]` for Facebook and `#video-title` for YouTube).
4. It compares the fetched content with the historical data stored in `last_posts.json`.
5. If the content is new, it uses **Axios** to send a message via the Telegram Bot API.
6. Finally, the bot updates `last_posts.json` and pushes the changes back to the repository.

## ⚙️ Setup and Installation

If you want to fork and run this bot for your own personal use, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/sohailaesmat14/auto-post-review-project.git](https://github.com/sohailaesmat14/auto-post-review-project.git)
cd auto-post-review-project
npm install
```

### 2. Setup Telegram Bot
Go to Telegram and search for @BotFather.
Send /newbot and follow the instructions to get your HTTP API Token.
Search for @userinfobot to get your personal Chat ID.

### 3. Extract Facebook Cookies (Optional - For Private Groups)
To allow the bot to read private Facebook groups:
Install the EditThisCookie extension.
Log in to your Facebook account, click the extension, and "Export" the cookies as JSON.

### 4. GitHub Secrets Configuration
Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions and add the following keys:
TELEGRAM_TOKEN: Your Telegram bot token.
CHAT_ID: Your personal Telegram chat ID.
FB_COOKIES: The exported JSON array of your Facebook cookies.

### 5. Repository Permissions
To allow the bot to save its memory, you must grant GitHub Actions write access:
Go to Settings -> Actions -> General.
Scroll down to Workflow permissions.
Select Read and write permissions.

## 📝 Customizing Targets
You can easily add or remove pages by editing the targets array in index.js.
Use the skipCount property to ignore pinned posts:

## ⚠️ Security Disclaimer
The FB_COOKIES secret grants full access to your Facebook session. Never share this string publicly. It is highly recommended to keep this repository Private or ensure your secrets are strictly managed within GitHub's environment.

👤 Author
Developed by Sohaila as a personal productivity and automation tool.
