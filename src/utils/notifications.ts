// Notification utility for toast notifications using Sonner
import { toast } from 'sonner'

/**
 * Show a success toast notification
 * @param message - The success message to display
 */
export const notifySuccess = (message: string): void => {
  toast.success(message)
}

/**
 * Show an error toast notification
 * @param message - The error message to display
 */
export const notifyError = (message: string): void => {
  toast.error(message)
}

/**
 * Show an info toast notification
 * @param message - The info message to display
 */
export const notifyInfo = (message: string): void => {
  toast.info(message)
}

/**
 * Show a warning toast notification
 * @param message - The warning message to display
 */
export const notifyWarning = (message: string): void => {
  toast.warning(message)
}
