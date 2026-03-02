/**
 * Format an ISO date string to a human-readable format
 * Handles both full ISO strings (2026-02-16T16:19:37.448) and date-only strings (2026-02-16)
 * @param dateString - ISO date string or null/undefined
 * @returns Formatted date string like "16 Feb 2026" or "N/A"
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Format: "16 Feb 2026"
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format an ISO date string to include time
 * @param dateString - ISO date string or null/undefined
 * @returns Formatted date-time string like "16 Feb 2026, 04:49 PM" or "N/A"
 */
export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Format: "16 Feb 2026, 04:49 PM"
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return "N/A";
  }
};

/**
 * Convert DD-MM-YYYY to YYYY-MM-DD for backend
 */
export const formatToBackendDate = (dateStr?: string | null): string => {
  if (!dateStr || !dateStr.includes('-')) return dateStr || "";
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

/**
 * Convert YYYY-MM-DD to DD-MM-YYYY for UI display
 */
export const formatToUIDate = (dateStr?: string | null): string => {
  if (!dateStr || !dateStr.includes('-')) return dateStr || "";
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};
