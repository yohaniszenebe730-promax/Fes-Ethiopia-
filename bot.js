const { Telegraf } = require('telegraf');
const chatHandler = require('./commands/chat');
const imageHandler = require('./commands/image');
const editHandler = require('./commands/edit');
const voiceHandler = require('./commands/voice');
const downloadHandler = require('./commands/download');
const searchHandler = require('./commands/search');
const filesHandler = require('./commands/files');
const converterHandler = require('./commands/converter');
const studyHandler = require('./commands/study');
const flashcardsHandler = require('./commands/flashcards');
const exportHandler = require('./commands/export');
const tutorialsHandler = require('./commands/tutorials');
const libraryHandler = require('./commands/library');
const adminHandler = require('./commands/admin');
const autopostHandler = require('./commands/autopost');

const OWNER_ID = parseInt(process.env.OWNER_CHAT_ID || '8334581306');
const CHANNEL = process.env.CHANNEL_USERNAME || 'Free_Ethio_server_FES';

// Menu bar (25 buttons)
const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: '💬 Chat' }, { text: '🎨 Image' }, { text: '✏️ Edit' }, { text: '🔊 Voice' }, { text: '📥 Down' }],
      [{ text: '🔎 Search' }, { text: '📚 Study' }, { text: '🃏 Cards' }, { text: '📊 Export' }, { text: '📖 Library' }],
      [{ text: '📂 Files' }, { text: '✏️ Rename' }, { text: '🔄 Convert' }, { text: '📺 Tutors' }, { text: '🔗 Join' }],
      [{ text: '⚙️ Set' }, { text: '🌐 Lang' }, { text: '👑 Admin' }, { text: '❓ Help' }, { text: '📢 Chan' }],
      [{ text: '⭐ Rate' }, { text: '📋 Feed' }, { text: '🏆 Lead' }, { text: '🔔 Notify' }, { text: '📤 Share' }]
    ],
    resize_keyboard: true,
    persistent: true
  }
};

// Join verification middleware
async function checkJoin(ctx, next) {
  const userId = ctx.from.id;
  const chatMember = await ctx.telegram.getChatMember(`@${CHANNEL}`, userId).catch(() => null);
  
  if (!chatMember || chatMember.status === 'left' || chatMember.status === 'kicked') {
    await ctx.reply(
      `🔐 JOIN OUR COMMUNITY FIRST!\n\nYou must join @${CHANNEL} before using FES AI.\n\n👉 [Join Channel](https://t.me/${CHANNEL})\n\nThen click ✅ I Joined`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 Join Channel', url: `https://t.me/${CHANNEL}` }],
            [{ text: '✅ I Joined - Verify Me', callback_data: 'verify_join' }]
          ]
        }
      }
    );
    return;
  }
  await next();
}

// Verify join callback
bot.action('verify_join', async (ctx) => {
  const userId = ctx.from.id;
  const chatMember = await ctx.telegram.getChatMember(`@${CHANNEL}`, userId).catch(() => null);
  
  if (chatMember && chatMember.status !== 'left' && chatMember.status !== 'kicked') {
    await ctx.reply('✅ Verified! Welcome to FES ETHIOPIA AI!\n\nChoose an option from the menu below.', mainMenu);
  } else {
    await ctx.reply('❌ You haven\'t joined the channel yet. Please join @${CHANNEL} first and try again.');
  }
  await ctx.answerCbQuery();
});

// Start command
bot.start(async (ctx) => {
  const user = ctx.from;
  await ctx.reply(
    `🎉 Welcome to FES ETHIOPIA AI, @${user.username || user.first_name}!\n\n✨ Your all-in-one AI assistant powered by FES AI.\n\n📌 Features:\n• 💬 AI Chat\n• 🎨 Image Generation\n• ✏️ Photo Editing\n• 🔊 Voice & Speak Mode\n• 📥 YouTube/TikTok Download\n• 🔄 File Converter (MP4→GIF)\n• 📚 Study & Flashcards\n• 📊 Export to Oxford PDF\n• 📂 File Manager\n\n⚠️ First, join our channel to continue.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 Join Channel', url: `https://t.me/${CHANNEL}` }],
          [{ text: '✅ I Joined - Verify Me', callback_data: 'verify_join' }]
        ]
      }
    }
  );
});

// Menu button handlers
bot.hears('💬 Chat', checkJoin, chatHandler);
bot.hears('🎨 Image', checkJoin, imageHandler);
bot.hears('✏️ Edit', checkJoin, editHandler);
bot.hears('🔊 Voice', checkJoin, voiceHandler);
bot.hears('📥 Down', checkJoin, downloadHandler);
bot.hears('🔎 Search', checkJoin, searchHandler);
bot.hears('📚 Study', checkJoin, studyHandler);
bot.hears('🃏 Cards', checkJoin, flashcardsHandler);
bot.hears('📊 Export', checkJoin, exportHandler);
bot.hears('📖 Library', checkJoin, libraryHandler);
bot.hears('📂 Files', checkJoin, filesHandler);
bot.hears('✏️ Rename', checkJoin, filesHandler.rename);
bot.hears('🔄 Convert', checkJoin, converterHandler);
bot.hears('📺 Tutors', checkJoin, tutorialsHandler);
bot.hears('🔗 Join', (ctx) => ctx.reply(`🔗 Join our channel: https://t.me/${CHANNEL}`));
bot.hears('⚙️ Set', checkJoin, (ctx) => ctx.reply('⚙️ Settings coming soon. Use /language to change language.'));
bot.hears('🌐 Lang', checkJoin, (ctx) => ctx.reply('🌐 Language: English\n\nUse /translate [text] to [language]'));
bot.hears('👑 Admin', checkJoin, adminHandler);
bot.hears('❓ Help', checkJoin, (ctx) => ctx.reply('❓ Help\n\nSend any message for AI chat.\n/start - Restart bot\n/export_study - Export study chat to PDF\n/yt [song] - Search YouTube\n/tt [link] - Download TikTok'));
bot.hears('📢 Chan', checkJoin, (ctx) => ctx.reply(`📢 Our Channel: @${CHANNEL}\n\nJoin for updates and resources!`));
bot.hears('⭐ Rate', checkJoin, (ctx) => ctx.reply('⭐ Rate FES AI\n\nSend /rate 1 to /rate 5'));
bot.hears('📋 Feed', checkJoin, (ctx) => ctx.reply('📋 Send /feedback [your message] to share feedback with admin.'));
bot.hears('🏆 Lead', checkJoin, (ctx) => ctx.reply('🏆 Leaderboard\n\nSend /leaderboard to see top users.'));
bot.hears('🔔 Notify', checkJoin, (ctx) => ctx.reply('🔔 Reminders\n\n/remind me [task] at [time]\n/reminders list\n/remind cancel [id]'));
bot.hears('📤 Share', checkJoin, (ctx) => ctx.reply('📤 Share this bot with friends!\n\nhttps://t.me/' + ctx.botInfo.username));

// Command handlers
bot.command('yt', checkJoin, downloadHandler.youtube);
bot.command('tt', checkJoin, downloadHandler.tiktok);
bot.command('search', checkJoin, searchHandler);
bot.command('export_study', checkJoin, exportHandler);
bot.command('summarize', checkJoin, studyHandler.summarize);
bot.command('rate', checkJoin, async (ctx) => {
  const rating = ctx.message.text.split(' ')[1];
  if (rating && [1,2,3,4,5].includes(parseInt(rating))) {
    await ctx.reply(`⭐ Thanks for rating FES AI ${rating}/5 stars!`);
  } else {
    await ctx.reply('⭐ Send /rate 1 to /rate 5');
  }
});
bot.command('feedback', checkJoin, async (ctx) => {
  const feedback = ctx.message.text.replace('/feedback', '').trim();
  if (feedback) {
    await ctx.reply('📋 Thank you for your feedback! Admin will review it.');
  }
});

module.exports = { setupBot: (bot) => {} };
