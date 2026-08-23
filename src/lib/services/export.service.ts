/**
 * Export Service
 *
 * Handles saving QR codes as PNG/SVG files via native dialogs,
 * copying PNG to system clipboard, and exporting history as JSON.
 */

import { save } from '@tauri-apps/plugin-dialog';
import { writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { writeImage } from '@tauri-apps/plugin-clipboard-manager';

// ============================================================
// Blob helpers
// ============================================================

/**
 * Converts a Blob to a Uint8Array for writing to the filesystem.
 */
async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

// ============================================================
// Public API
// ============================================================

/**
 * Opens a native save dialog and writes a PNG blob to disk.
 *
 * @param blob - PNG image blob from qr-code-styling
 * @param suggestedName - Default filename (without extension)
 * @returns true if saved successfully, false if user cancelled
 */
export async function savePNG(blob: Blob, suggestedName = 'binimoy-qr'): Promise<boolean> {
  const path = await save({
    title: 'Save QR Code as PNG',
    defaultPath: `${suggestedName}.png`,
    filters: [{ name: 'PNG Image', extensions: ['png'] }],
  });

  if (!path) return false;

  const bytes = await blobToBytes(blob);
  await writeFile(path, bytes);
  return true;
}

/**
 * Opens a native save dialog and writes an SVG blob to disk.
 *
 * @param blob - SVG image blob from qr-code-styling
 * @param suggestedName - Default filename (without extension)
 * @returns true if saved successfully, false if user cancelled
 */
export async function saveSVG(blob: Blob, suggestedName = 'binimoy-qr'): Promise<boolean> {
  const path = await save({
    title: 'Save QR Code as SVG',
    defaultPath: `${suggestedName}.svg`,
    filters: [{ name: 'SVG Image', extensions: ['svg'] }],
  });

  if (!path) return false;

  const text = await blob.text();
  await writeTextFile(path, text);
  return true;
}

/**
 * Copies a PNG blob to the system clipboard.
 *
 * @param blob - PNG image blob from qr-code-styling
 */
export async function copyPNGToClipboard(blob: Blob): Promise<void> {
  const bytes = await blobToBytes(blob);
  await writeImage(bytes);
}

/**
 * Opens a native save dialog and writes a JSON string to disk.
 *
 * @param jsonContent - The JSON string to save
 * @param suggestedName - Default filename (without extension)
 * @returns true if saved successfully, false if user cancelled
 */
export async function saveJSON(jsonContent: string, suggestedName = 'binimoy-history'): Promise<boolean> {
  const path = await save({
    title: 'Export History as JSON',
    defaultPath: `${suggestedName}.json`,
    filters: [{ name: 'JSON File', extensions: ['json'] }],
  });

  if (!path) return false;

  await writeTextFile(path, jsonContent);
  return true;
}
