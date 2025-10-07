/**
 * Utilitários para manipulação de leads
 */

/**
 * Normaliza um número de telefone removendo caracteres especiais
 * e formatando para o padrão brasileiro
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';

  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Se tem 11 dígitos, assume que é celular com DDD
  if (cleanPhone.length === 11) {
    return cleanPhone;
  }

  // Se tem 10 dígitos, assume que é fixo com DDD
  if (cleanPhone.length === 10) {
    return cleanPhone;
  }

  // Se tem 9 dígitos, assume que é celular sem DDD
  if (cleanPhone.length === 9) {
    return cleanPhone;
  }

  // Se tem 8 dígitos, assume que é fixo sem DDD
  if (cleanPhone.length === 8) {
    return cleanPhone;
  }

  // Para outros casos, retorna como está
  return cleanPhone;
}

/**
 * Valida se um telefone é válido
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Telefone é opcional

  const cleanPhone = normalizePhone(phone);

  // Aceita telefones com 8, 9, 10 ou 11 dígitos
  return cleanPhone.length >= 8 && cleanPhone.length <= 11;
}

/**
 * Normaliza um email removendo espaços e convertendo para minúsculas
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';

  return email.trim().toLowerCase();
}

/**
 * Valida se um email é válido
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email é opcional

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formata um número de telefone para exibição
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';

  const cleanPhone = normalizePhone(phone);

  // Celular com DDD (11 dígitos)
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }

  // Fixo com DDD (10 dígitos)
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }

  // Celular sem DDD (9 dígitos)
  if (cleanPhone.length === 9) {
    return `${cleanPhone.slice(0, 5)}-${cleanPhone.slice(5)}`;
  }

  // Fixo sem DDD (8 dígitos)
  if (cleanPhone.length === 8) {
    return `${cleanPhone.slice(0, 4)}-${cleanPhone.slice(4)}`;
  }

  // Para outros casos, retorna como está
  return cleanPhone;
}

/**
 * Converte source enum para texto legível
 */
export function getSourceLabel(source: string): string {
  const sourceLabels: Record<string, string> = {
    WEB: 'Site',
    PHONE: 'Telefone',
    REFERRAL: 'Indicação',
    SOCIAL: 'Redes Sociais',
    OTHER: 'Outros',
  };

  return sourceLabels[source] || source;
}

/**
 * Gera cores para diferentes sources
 */
export function getSourceColor(source: string): string {
  const sourceColors: Record<string, string> = {
    WEB: '#3B82F6', // blue
    PHONE: '#10B981', // green
    REFERRAL: '#F59E0B', // yellow
    SOCIAL: '#8B5CF6', // purple
    OTHER: '#6B7280', // gray
  };

  return sourceColors[source] || '#6B7280';
}
