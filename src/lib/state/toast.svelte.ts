import type { Toast, ToastType } from '$lib/types';

/**
 * Toast Notification State
 *
 * Manages an ephemeral stack of toast notifications.
 * Automatically removes toasts after a specified duration.
 */
class ToastState {
  toasts = $state<Toast[]>([]);

  /**
   * Displays a new toast message.
   * Auto-dismisses after 3 seconds by default.
   */
  show(message: string, type: ToastType = 'info', durationMs = 3000) {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, message, type };
    
    this.toasts.push(newToast);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  /**
   * Manually dismiss a toast early by its ID.
   */
  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}

// Export a singleton instance
export const toaster = new ToastState();
