import "dotenv/config";
import { createBot, createProvider, createFlow } from "@builderbot/bot";
import { MemoryDB } from "@builderbot/bot";
import { httpInject } from "@builderbot-plugins/openai-assistants";
import { IAFlow } from "./flows/IAFlow";
import { MetaProvider } from "@builderbot/provider-meta";

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
  const adapterProvider = createProvider(MetaProvider, {
    jwtToken: process.env.JWT_TOKEN, //EAARBW3ZBGU0UBAACDjtQIzI8JuEa.............
    numberId: process.env.NUMBER_ID, //103975305758520
    verifyToken: process.env.VERIFY_TOKEN, //LO_QUE_SEA,
    version: "v16.0",
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
