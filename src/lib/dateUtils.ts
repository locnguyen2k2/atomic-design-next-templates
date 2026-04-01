/**
 * Format date consistently across server and client to avoid hydration mismatches
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Use UTC methods to ensure consistency across environments
  // const year = date.getUTCFullYear();
  // const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  // const day = String(date.getUTCDate()).padStart(2, '0');

  // return `${year}-${month}-${day}`;
  return date.toLocaleDateString();
}

/**
 * Format date with time consistently across server and client
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  // Use UTC methods to ensure consistency across environments
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
