// Minimal API service with only basic functionality
const API_BASE_URL = import.meta.env.VITE_API_URL;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Only keeping essential types and removing workspace/document APIs
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Remove all workspace and document APIs - keeping file for future use
export const api = {
  // Placeholder for future basic API calls if needed
};
