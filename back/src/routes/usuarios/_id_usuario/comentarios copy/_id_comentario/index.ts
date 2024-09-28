import { FastifyPluginAsync } from "fastify";
import * as comentarioService from "../../../../../services/comentarios.js";
import { IdComentarioSchema, IdComentarioType } from "../../../../../types/comentarios.js";
import { IdUsuarioSchema } from "../../../../../types/usuario.js";

const comentariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      summary: "Obtener una tarea especifica",
      description:
        "### Implementar y validar: \n " +
        " - token \n " +
        " - params \n " +
        " - response. \n - Solo admin tiene permisos.",
      tags: ["comentarios"],
      params: IdComentarioSchema,
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      const { id_comentario } = request.params as IdComentarioType;
      return comentarioService.findById(id_comentario);
    },
  });
};

export default comentariosRoutes;
