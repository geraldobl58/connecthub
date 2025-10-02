import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formatar data para exibição em tabelas
 * Formato: dd/MM/yyyy às HH:mm
 */
export const formatTableDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

/**
 * Formatar data para exibição curta
 * Formato: dd/MM/yyyy
 */
export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Formatar data para exibição longa
 * Formato: dd 'de' MMMM 'de' yyyy
 */
export const formatLongDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formatar data relativa (ex: "há 2 dias")
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { formatDistanceToNow } = require("date-fns");
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: ptBR,
  });
};
