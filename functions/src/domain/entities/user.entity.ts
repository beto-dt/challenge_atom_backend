/**
 * Entidad que representa un usuario en el dominio de la aplicación
 */
export interface User {
  id?: string;
  email: string;
  createdAt: Date;
}
