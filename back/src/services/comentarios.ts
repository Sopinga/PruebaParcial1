import { ComentarioFullType, ComentarioType } from "../types/comentarios.js";
import { NotFoundError } from "../util/errors.js";
import db from "./db.js";

const baseQuery = `
  with Comentarios AS(
    SELECT T.*,U.username as creador, array_agg(UA.username)  as usuarios
    FROM public.comentarios T
    JOIN public.usuarios U ON U.id_usuario=T.id_usuario 
    LEFT JOIN public.usuario_comentarios ut on UT.id_comentario = T.id_comentario
    LEFT JOIN public.usuarios UA on UA.id_usuario = UT.id_usuario
    group by T.id_comentario, U.username
  )
  SELECT * FROM comentarios T
`;

export const findAll = async () => {
  const res = await db.query(baseQuery);
  return res.rows;
};

export const findCreadasByUserId = async (id_usuario: number) => {
  const res = await db.query(
    `
    ${baseQuery}
    WHERE T.id_usuario=$1
    `,
    [id_usuario]
  );
  if (res.rowCount === 0) throw new NotFoundError(""); //FIXME: No diferencia si el usuario no existe o no tiene Comentarios creadas.
  return res.rows;
};

export const findById = async (id_comentario: number): Promise<ComentarioFullType> => {
  const res = await db.query(
    `
    ${baseQuery}
    WHERE id_comentario=$1
    `,
    [id_comentario]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
  return res.rows[0];
};

export const findByIdAndCreator = async (
  id_tarea: number,
  id_comentario: number,
  id_usuario: number
): Promise<ComentarioFullType> => {
  const res = await db.query(
    `
    ${baseQuery}
    WHERE T.id_tarea=$1 T.id_comentario=$2 AND T.id_usuario = $3
    `,
    [id_tarea, id_comentario, id_usuario]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
  return res.rows[0];
};

export const deleteByIds = async (id_usuario: number, id_tarea: number, id_comentario: number) => {
  const res = await db.query(
    "DELETE FROM public.comentarios WHERE id_usuario=$1 AND id_tarea=$2 AND id_comentario=$3",
    [id_usuario, id_tarea, id_comentario]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
};

export const unassign = async (id_usuario: number, id_tarea:number, id_comentario: number) => {
  const res = await db.query(
    "DELETE FROM public.usuario_comentarios WHERE id_usuario=$1 AND id_tarea=$2 AND id_comentario=$3",
    [id_usuario, id_tarea, id_comentario]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
};

export const assign = async (id_usuario: number, id_tarea:number, id_comentario: number) => {
  const res = await db.query(
    "INSERT INTO public.usuario_comentarios(id_usuario,id_tarea,id_comentario) VALUES($1,$2,$3)",
    [id_usuario, id_tarea, id_comentario]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
};

export const updateById = async (id_comentario: number, comentario: ComentarioType) => {
  const res = await db.query(
    `
    UPDATE public.comentarios  
    SET nombre=$2, descripcion=$3 
    WHERE id_comentario=$1;
    `,
    [id_comentario, comentario.nombre, comentario.descripcion]
  );
  if (res.rowCount === 0) throw new NotFoundError("");
  return findById(id_comentario);
};

export const create = async (id_usuario: number, id_tarea: number, nuevoComentario: ComentarioType) => {
  const res = await db.query(
    `
    INSERT INTO public.comentarios (nombre,descripcion,id_usuario) 
    VALUES($1, $2, $3) RETURNING *;
    `,
    [nuevoComentario.nombre, nuevoComentario.descripcion, id_usuario]
  );
  const Comentario_creada: ComentarioFullType = res.rows[0];
  return findById(Comentario_creada.id_comentario);
};
