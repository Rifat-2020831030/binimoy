/**
 * QR Code Generation Service
 *
 * Wraps the `qr-code-styling` library with a clean interface.
 * Uses dynamic import to avoid SSR/Vite bundling issues since
 * qr-code-styling depends on browser DOM APIs.
 */

import type { QROptions } from '$lib/types';
import { DEFAULT_QR_OPTIONS } from '$lib/types';

// Lazily loaded QRCodeStyling constructor
let QRCodeStylingCtor: typeof import('qr-code-styling').default | null = null;

/**
 * Ensures qr-code-styling is loaded (browser-only, dynamic import).
 * Caches the constructor for subsequent calls.
 */
async function getQRCodeStyling() {
  if (!QRCodeStylingCtor) {
    const module = await import('qr-code-styling');
    QRCodeStylingCtor = module.default;
  }
  return QRCodeStylingCtor;
}

/**
 * Maps our QROptions to qr-code-styling constructor options.
 */
function buildStylingOptions(data: string, options: QROptions, size: number) {
  return {
    type: 'svg' as const,
    width: size,
    height: size,
    data,
    margin: options.margin,
    qrOptions: {
      errorCorrectionLevel: options.errorCorrectionLevel,
    },
    dotsOptions: {
      type: options.dotStyle,
      color: options.darkColor,
    },
    cornersSquareOptions: {
      type: options.cornersStyle,
      color: options.darkColor,
    },
    cornersDotOptions: {
      type: options.cornersStyle === 'extra-rounded' ? 'dot' as const : options.cornersStyle,
      color: options.darkColor,
    },
    backgroundOptions: {
      color: options.lightColor,
    },
  };
}

// ============================================================
// Public API
// ============================================================

/** QRCodeStyling instance type (opaque to consumers) */
export type QRInstance = InstanceType<typeof import('qr-code-styling').default>;

/**
 * Creates a new QR code instance and appends it to a container element.
 *
 * @param container - DOM element to render into
 * @param data - The URL or text to encode
 * @param options - Visual styling options
 * @param size - Pixel dimensions (default 256)
 * @returns The QRCodeStyling instance for later updates
 */
export async function createQRCode(
  container: HTMLElement,
  data: string,
  options: QROptions = DEFAULT_QR_OPTIONS,
  size = 256,
): Promise<QRInstance> {
  const QRCodeStyling = await getQRCodeStyling();
  const qrCode = new QRCodeStyling(buildStylingOptions(data, options, size));
  qrCode.append(container);
  return qrCode;
}

/**
 * Updates an existing QR code instance with new data and/or options.
 * Re-renders in place without remounting.
 */
export function updateQRCode(
  instance: QRInstance,
  data: string,
  options: QROptions = DEFAULT_QR_OPTIONS,
  size = 256,
): void {
  instance.update(buildStylingOptions(data, options, size));
}

/**
 * Gets the raw image data from a QR code instance.
 *
 * @param instance - QRCodeStyling instance
 * @param format - Output format: 'png', 'jpeg', 'webp', or 'svg'
 * @returns A Blob of the rendered QR code, or null on failure
 */
export async function getQRRawData(
  instance: QRInstance,
  format: 'png' | 'jpeg' | 'webp' | 'svg' = 'png',
): Promise<Blob | null> {
  const data = await instance.getRawData(format);
  if (data instanceof Blob) return data;
  return null;
}

/**
 * Creates a small QR code thumbnail for history list items.
 * Uses minimal options for fast rendering.
 */
export async function createThumbnail(
  container: HTMLElement,
  data: string,
  options: Partial<QROptions> = {},
): Promise<QRInstance> {
  const mergedOptions: QROptions = { ...DEFAULT_QR_OPTIONS, ...options };
  const QRCodeStyling = await getQRCodeStyling();
  const qrCode = new QRCodeStyling(buildStylingOptions(data, mergedOptions, 48));
  qrCode.append(container);
  return qrCode;
}
