import { Static, Type } from "@sinclair/typebox";
export const IdComentarioSchema = Type.Object({
  id_comentario: Type.Integer({ description: "Identificador único del usuario" }),
});
export type IdComentarioType = Static<typeof IdComentarioSchema>;

export const ComentarioSchema = Type.Object(
  {
    nombre: Type.String({ description: "Nombre del usuario" }),
    descripcion: Type.Integer({ description: "Descripcion del comentario" }),
  },
  { examples: [{ nombre: "Sopita", descripcion: "Este es un comentario de prueba" }] }
);
export type ComentarioType = Static<typeof ComentarioSchema>;

export const ComentarioFullSchema = Type.Intersect(
  [
    IdComentarioSchema,
    ComentarioSchema,
    Type.Object({
      id_usuario: Type.Integer({
        description: "Id del usuario que creó el Comentario.",
      }),
      creador: Type.String({
        description: "username del usuario que creó el Comentario.",
      }),
    }),
  ],
  {
    examples: [
      {
        id_tarea: 1,
        id_comentario: 1,
        nombre: "Comentario 1 modificado.",
        id_creador: 2,
      },
      {
        id_tarea: 1,
        id_comentario: 1,
        nombre: "Comentario 1 eliminado por admin.",
        id_creador: 4,
      },
    ],
  }
);
export type ComentarioFullType = Static<typeof ComentarioFullSchema>;
