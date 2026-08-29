const mineflayer = require('mineflayer');

const host = process.env.SERVER_IP || 'worldseries-toqh.aternos.me';
const port = parseInt(process.env.SERVER_PORT || '38064', 10);
const username = process.env.BOT_USERNAME || 'Raboot_356';

console.log(`[NPC] Iniciando tentativa de conexão em ${host}:${port}...`);

function createBot() {
    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: username,
        version: false, // Autodetecta a versão (1.8 a 1.21+)
        checkTimeoutInterval: 60000
    });

    let loopInterval = null;

    bot.on('login', () => {
        console.log(`[NPC] Conexão efetuada. Carregando dados do servidor...`);
    });

    bot.on('spawn', () => {
        console.log(`[NPC] O bot "${bot.username}" entrou no mundo com sucesso!`);

        // Descomente a linha abaixo se o seu servidor exigir senha para entrar:
        // bot.chat('/login SUA_SENHA_AQUI');

        // Cancela loops anteriores para não acumular
        if (loopInterval) clearInterval(loopInterval);

        // Inicia a rotina Anti-AFK apenas DEPOIS de estar no mundo
        loopInterval = setInterval(async () => {
            if (!bot || !bot.entity) return;

            try {
                // 1. Apenas pula para evitar kick por inatividade
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log('[NPC] Pulo Anti-AFK executado.');

                // 2. Interação opcional com baú (com validações de segurança)
                if (bot.registry && bot.registry.blocksByName && bot.registry.blocksByName.chest) {
                    const chestBlock = bot.findBlock({
                        matching: bot.registry.blocksByName.chest.id,
                        maxDistance: 4
                    });

                    if (chestBlock) {
                        const chest = await bot.openContainer(chestBlock);
                        await new Promise(r => setTimeout(r, 1500));
                        chest.close();
                        console.log('[NPC] Baú aberto e fechado com sucesso.');
                    }
                }
            } catch (err) {
                // Captura erro do baú sem fechar o bot
                console.log(`[NPC] Aviso na rotina: ${err.message}`);
            }
        }, 30000); // Roda a cada 30 segundos
    });

    // Mostra exatamente o motivo se o Aternos expulsar o bot
    bot.on('kicked', (reason) => {
        console.log(`[KICK] O bot foi expulsos do servidor. Motivo:`, reason);
    });

    bot.on('end', (reason) => {
        console.log(`[NPC] Conexão finalizada (${reason}). Tentando reconectar em 20s...`);
        if (loopInterval) clearInterval(loopInterval);
        setTimeout(createBot, 20000);
    });

    bot.on('error', (err) => {
        console.log(`[ERRO] Falha na rede: ${err.message}`);
    });
}

createBot();
