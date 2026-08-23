// ============================================================
// QR Options — controls the visual styling of generated QR codes
// ============================================================

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotStyle =
  | 'rounded'
  | 'dots'
  | 'classy-rounded'
  | 'square'
  | 'extra-rounded';

export type CornerStyle = 'extra-rounded' | 'dot' | 'square';

export interface QROptions {
  errorCorrectionLevel: ErrorCorrectionLevel;
  darkColor: string;
  lightColor: string;
  margin: number;
  dotStyle: DotStyle;
  cornersStyle: CornerStyle;
}

export const DEFAULT_QR_OPTIONS: QROptions = {
  errorCorrectionLevel: 'M',
  darkColor: '#1c1917',   // stone-900
  lightColor: '#fafaf9',  // stone-50
  margin: 4,
  dotStyle: 'rounded',
  cornersStyle: 'extra-rounded',
};

// ============================================================
// QR Entry — a single generated QR code record in history
// ============================================================

export interface QREntry {
  id: string;
  url: string;
  label?: string;
  createdAt: number;
  pinned: boolean;
  options: QROptions;
}

// ============================================================
// Toast — ephemeral notification messages
// ============================================================

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// ============================================================
// UI State — enums for history panel controls
// ============================================================

export type SortMode = 'newest' | 'oldest' | 'alpha';

export type FilterMode = 'all' | 'pinned';

// ============================================================
// Input validation — result types
// ============================================================

export type InputType = 'url' | 'text' | 'empty' | 'too-long';
