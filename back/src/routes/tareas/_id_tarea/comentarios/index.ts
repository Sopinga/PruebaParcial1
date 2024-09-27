import { FastifyPluginAsync } from "fastify";
import * as comentarioService from "../../../../services/comentarios.js";
import { ComentarioFullSchema } from "../../../../types/comentarios.js";
import { Type } from "@sinclair/typebox";

const comentariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      summary: "Listado de comenatarios.",
      description:
        "### Implementar y validar: \n " +
        " - token \n " +
        " - response. \n - Solo admin puede ver todos los comentarios.",
      tags: ["comentarios"],
      response: {
        200: {
          description: "Lista de tareas completo.",
          content: {
            "application/json": {
              schema: Type.Array(ComentarioFullSchema),
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      return comentarioService.findAll();
    },
  });
};

export default comentariosRoutes;
