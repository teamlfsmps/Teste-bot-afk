const mineflayer = require('mineflayer');

const host = process.env.SERVER_IP; worldseries-toqh.aternos.me
const port = parseInt(process.env.SERVER_PORT || '38064, 10);
const username = process.env.BOT_USERNAME || 'AFK_Bot';

function createBot() {
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username,
    version: false // Detecta a versão do servidor automaticamente
  });

  bot.on('spawn', () => {
    console.log(`Bot conectado com sucesso como ${bot.username}!`);
    
    // Movimento simples para evitar o kick por inatividade do servidor
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000); // Pula a cada 30 segundos
  });

  bot.on('error', (err) => {
    console.error('Erro no bot:', err);
  });

  bot.on('end', (reason) => {
    console.log(`Bot desconectado: ${reason}`);
  });
}

createBot();
