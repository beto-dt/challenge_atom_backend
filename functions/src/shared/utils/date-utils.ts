/**
     * Utilidades para manejo de fechas y tiempos
     * @return {DateUtils} Objeto con utilidades para fechas
     */
export const DateUtils = {
  /**
       * Obtiene la fecha actual
       * @return {Date} Nueva instancia de Date con la fecha y hora actual
       */
  now(): Date {
    return new Date();
  },

  /**
       * Formatea una fecha según el formato especificado
       * @param {Date} date Fecha a formatear
       * @param {string} format Formato deseado
       * @return {string} String con la fecha formateada
       */
  format(date: Date, format = "yyyy-MM-dd"): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return format
      .replace("yyyy", year)
      .replace("MM", month)
      .replace("dd", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  },

  /**
       * Convierte una fecha a formato ISO (YYYY-MM-DD)
       * @param {Date} date Fecha a convertir
       * @return {string} String en formato ISO
       */
  toISODate(date: Date): string {
    return this.format(date, "yyyy-MM-dd");
  },

  /**
       * Convierte una fecha a formato ISO con tiempo (YYYY-MM-DDTHH:mm:ss)
       * @param {Date} date Fecha a convertir
       * @return {string} String en formato ISO con tiempo
       */
  toISODateTime(date: Date): string {
    return date.toISOString();
  },

  /**
       * Parsea un string a objeto Date
       * @param {string} dateStr String de fecha
       * @return {Date|null} Objeto Date o null si es inválido
       */
  parse(dateStr: string): Date | null {
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  },

  /**
       * Añade días a una fecha
       * @param {Date} date Fecha base
       * @param {number} days Número de días a añadir (puede ser negativo)
       * @return {Date} Nueva fecha con los días añadidos
       */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
       * Añade meses a una fecha
       * @param {Date} date Fecha base
       * @param {number} months Número de meses a añadir (puede ser negativo)
       * @return {Date} Nueva fecha con los meses añadidos
       */
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  /**
       * Calcula la diferencia en días entre dos fechas
       * @param {Date} start Fecha inicial
       * @param {Date} end Fecha final
       * @return {number} Número de días de diferencia
       */
  diffInDays(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
       * Comprueba si una fecha está entre otras dos
       * @param {Date} date Fecha a comprobar
       * @param {Date} start Fecha inicial
       * @param {Date} end Fecha final
       * @return {boolean} true si la fecha está en el rango
       */
  isBetween(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  },

  /**
       * Comprueba si dos fechas son el mismo día
       * @param {Date} date1 Primera fecha
       * @param {Date} date2 Segunda fecha
       * @return {boolean} true si son el mismo día
       */
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
    );
  },

  /**
       * Obtiene el nombre del día de la semana
       * @param {Date} date Fecha
       * @param {string} locale Localización (default 'es-ES')
       * @return {string} Nombre del día
       */
  getDayName(date: Date, locale = "es-ES"): string {
    return date.toLocaleDateString(locale, {weekday: "long"});
  },

  /**
       * Obtiene el nombre del mes
       * @param {Date} date Fecha
       * @param {string} locale Localización (default 'es-ES')
       * @return {string} Nombre del mes
       */
  getMonthName(date: Date, locale = "es-ES"): string {
    return date.toLocaleDateString(locale, {month: "long"});
  },

  /**
       * Convierte una fecha a texto relativo (ej: "hace 2 días")
       * @param {Date} date Fecha a convertir
       * @return {string} Texto descriptivo relativo
       */
  toRelativeTime(date: Date): string {
    const now = this.now();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "hace un momento";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ?
        "hace un minuto" :
        `hace ${diffInMinutes} minutos`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ?
        "hace una hora" :
        `hace ${diffInHours} horas`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays === 1 ?
        "ayer" :
        `hace ${diffInDays} días`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ?
        "hace una semana" :
        `hace ${diffInWeeks} semanas`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ?
        "hace un mes" :
        `hace ${diffInMonths} meses`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ?
      "hace un año" :
      `hace ${diffInYears} años`;
  },
};
