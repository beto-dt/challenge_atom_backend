/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDto {
    email: string;
}

/**
 * DTO para representar un usuario en las respuestas
 */
export interface UserResponseDto {
    id: string;
    email: string;
    createdAt: string;
}

/**
 * Función para convertir una entidad User a UserResponseDto
 * @param {Object} user The user entity to convert
 * @param {string=} user.id - Optional user ID
 * @param {string} user.email - User email
 * @param {Date} user.createdAt - User creation date
 * @return {UserResponseDto} The user response DTO
 */
export function toUserResponseDto(user: {
    id?: string;
    email: string;
    createdAt: Date;
}): UserResponseDto {
  return {
    id: user.id || "",
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
