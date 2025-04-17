import {User} from "@domain/entities/user.entity";

export interface UserRepository {
    /**
     * Busca un usuario por su dirección de email
     * @param email Email del usuario
     * @returns Promesa con el usuario o null si no existe
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Obtiene un usuario por su ID
     * @param id ID del usuario
     * @returns Promesa con el usuario o null si no existe
     */
    findById(id: string): Promise<User | null>;

    /**
     * Crea un nuevo usuario
     * @param user Datos del usuario a crear
     * @returns Promesa con el usuario creado (incluyendo ID generado)
     */
    create(user: User): Promise<User>;
}
