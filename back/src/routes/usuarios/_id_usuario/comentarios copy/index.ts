import { FastifyPluginAsync } from "fastify";
import * as comentarioService from "../../../../services/comentarios.js";
import { ComentarioFullSchema, ComentarioSchema, ComentarioType } from "../../../../types/comentarios.js";
import { IdTareaType } from "../../../../types/tarea.js";
import { IdUsuarioType } from "../../../../types/usuario.js";
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

  fastify.post("/", {
    schema: {
      tags: ["comentarios-usuario"],
      summary: "Usuario crea un comentario.",
      description:
        "### El codigo de respuesta debe ser el adecuado \n ### El creador del comentario se toma de los params \n ### Implementar y validar: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - que el usuario que ejecuta es el creador del comentario \n " +
        " - response. \n ",
      body: ComentarioSchema,
      response: {
        201: {
          description: "Tarea creada.",
          content: {
            "application/json": {
              schema: ComentarioFullSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelf],
    handler: async function (request, reply) {
      const nuevoComentario = request.body as ComentarioType;
      const { id_tarea } = request.params as IdTareaType;
      const { id_usuario } = request.params as IdUsuarioType;
      reply.code(201);
      return comentarioService.create(id_usuario, id_tarea, nuevoComentario);
    },
  });
};

export default comentariosRoutes;
