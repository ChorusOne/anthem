import { Intent, Position, Toaster } from "@blueprintjs/core";

/** ===========================================================================
 * Toast Animation Setup
 * ============================================================================
 */

/**
 * Singleton instance of Blueprint Toaster. Create separate instances for
 * different options.
 */
const ToastAnimation = Toaster.create({
  canEscapeKeyClear: true,
  position: Position.TOP,
  className: "blueprint-toaster-bar",
});

/**
 * Retrieve all existing toasts and dismiss them.
 */
const dismissAllToasts = () => {
  const allToasts = ToastAnimation.getToasts();

  for (const toast of allToasts) {
    const { key } = toast;
    if (typeof key === "string") {
      ToastAnimation.dismiss(key);
    }
  }
};

/**
 * Helper to render a toast with a specified intent.
 */
const renderToast = (
  message: string,
  intent: Intent,
  className?: string,
): void => {
  /* Dismiss any existing toasts first */
  dismissAllToasts();

  ToastAnimation.show({
    message,
    intent,
    className,
    timeout: 3000,
  });
};

/**
 * Helper method to pass Intent and other provided arguments to the
 * renderToast method to apply the same behavior for different Toast
 * intents.
 */
const renderToastHelper = (intent: Intent, className?: string) => (
  message: string,
) => {
  renderToast(message, intent, className);
};

/**
 * Toast Class which exposes convenient to use methods.
 */
class Toast {
  info = renderToastHelper(Intent.NONE);
  success = renderToastHelper(Intent.SUCCESS, "custom-success-toast");
  primary = renderToastHelper(Intent.PRIMARY);
  warn = renderToastHelper(Intent.WARNING, "custom-warning-toast");
  danger = renderToastHelper(Intent.DANGER);
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default new Toast();
