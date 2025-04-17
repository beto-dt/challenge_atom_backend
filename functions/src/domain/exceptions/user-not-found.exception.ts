/**
 * Excepción que se lanza cuando un usuario no se encuentra
 */
export class UserNotFoundException extends Error {
  /**
   * Constructor
   * @param {string} identifier ID o email del usuario que no se encontró
   * @param {boolean} isEmail Indica si el identificador es un email
   */
  constructor(
    public readonly identifier: string,
    public readonly isEmail: boolean = false,
  ) {
    const idType = isEmail ? "email" : "ID";
    super(`El usuario con ${idType} ${identifier} no fue encontrado`);
    this.name = "UserNotFoundException";
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}
