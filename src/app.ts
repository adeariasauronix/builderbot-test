import "dotenv/config";
import { createBot, createProvider, createFlow } from "@builderbot/bot";
import { MemoryDB } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { httpInject } from "@builderbot-plugins/openai-assistants";
import { IAFlow } from "./flows/IAFlow";

/** Puerto en el que se ejecutará el servidor */
const PORT = process.env.PORT ?? 3008;
/** ID del asistente de OpenAI */

/**
 * Función principal que configura y inicia el bot
 * @async
 * @returns {Promise<void>}
 */
const main = async () => {
  /**
   * Flujo del bot
   * @type {import('@builderbot/bot').Flow<BaileysProvider, MemoryDB>}
   */
  const adapterFlow = createFlow([IAFlow]);

  /**
   * Proveedor de servicios de mensajería
   * @type {BaileysProvider}
   */
  const adapterProvider = createProvider(BaileysProvider, {
    groupsIgnore: true,
    readStatus: false,
  });

  /**
   * Base de datos en memoria para el bot
   * @type {MemoryDB}
   */
  const adapterDB = new MemoryDB();

  /**
   * Configuración y creación del bot
   * @type {import('@builderbot/bot').Bot<BaileysProvider, MemoryDB>}
   */
  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  httpInject(adapterProvider.server);
  httpServer(+PORT);
};

main();
