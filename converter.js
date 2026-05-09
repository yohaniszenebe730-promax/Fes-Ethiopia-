const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');

async function convertVideoToGif(inputPath, outputPath) {
  await execPromise(`ffmpeg -i "${inputPath}" -vf "fps=10,scale=320:-1" -t 5 "${outputPath}"`);
  return outputPath;
}

async function convertVideoTo3gp(inputPath, outputPath) {
  await execPromise(`ffmpeg -i "${inputPath}" -c:v h263 -c:a libvo_aacenc -b:v 200k -b:a 64k "${outputPath}"`);
  return outputPath;
}

async function extractAudio(inputPath, outputPath) {
  await execPromise(`ffmpeg -i "${inputPath}" -q:a 0 -map a "${outputPath}"`);
  return outputPath;
}

module.exports = async (ctx) => {
  await ctx.reply('🔄 FES AI File Converter\n\nSend me a video or audio file, then choose conversion format.\n\nSupported: MP4→GIF, MP4→3GP, Extract Audio from Video');
  
  ctx.on('video', async (ctx) => {
    const file = await ctx.telegram.getFile(ctx.message.video.file_id);
    const inputPath = `/tmp/input_${Date.now()}.mp4`;
    
    // Download file
    const response = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`);
    const buffer = await response.buffer();
    fs.writeFileSync(inputPath, buffer);
    
    await ctx.reply('🎬 Video received! Choose conversion:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🖼️ MP4 → GIF', callback_data: `conv_gif_${Date.now()}` }],
          [{ text: '📱 MP4 → 3GP', callback_data: `conv_3gp_${Date.now()}` }],
          [{ text: '🎵 Extract Audio (MP3)', callback_data: `conv_mp3_${Date.now()}` }]
        ]
      }
    });
    
    ctx.session = ctx.session || {};
    ctx.session.inputPath = inputPath;
  });
};

// Callback handlers
bot.action(/conv_(gif|3gp|mp3)_(.+)/, async (ctx) => {
  const format = ctx.match[1];
  const inputPath = ctx.session.inputPath;
  
  if (!inputPath || !fs.existsSync(inputPath)) {
    await ctx.reply('❌ File not found. Please send the video again.');
    return;
  }
  
  await ctx.reply(`🔄 Converting to ${format.toUpperCase()}... Please wait.`);
  
  const outputPath = `/tmp/output_${Date.now()}.${format === 'mp3' ? 'mp3' : format === 'gif' ? 'gif' : '3gp'}`;
  
  try {
    if (format === 'gif') await convertVideoToGif(inputPath, outputPath);
    else if (format === '3gp') await convertVideoTo3gp(inputPath, outputPath);
    else if (format === 'mp3') await extractAudio(inputPath, outputPath);
    
    if (format === 'mp3') {
      await ctx.replyWithAudio({ source: outputPath }, { caption: '✅ FES AI Converter: Audio extracted successfully!' });
    } else if (format === 'gif') {
      await ctx.replyWithAnimation({ source: outputPath }, { caption: '✅ FES AI Converter: MP4 to GIF conversion complete!' });
    } else {
      await ctx.replyWithVideo({ source: outputPath }, { caption: '✅ FES AI Converter: MP4 to 3GP conversion complete!' });
    }
    
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  } catch (error) {
    await ctx.reply('❌ Conversion failed. Please try again.');
  }
  
  await ctx.answerCbQuery();
});
