import { Injectable } from '@angular/core';

type StorageExportPayload = {
  format: 'taxspain-storage-export';
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
};

@Injectable({
  providedIn: 'root'
})
export class StorageTransferService {
  private readonly filePrefix = 'taxspain-storage';

  exportToJsonFile(): void {
    if (!this.isBrowser()) {
      return;
    }

    const payload: StorageExportPayload = {
      format: 'taxspain-storage-export',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: this.getAllStorageEntries()
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const datePart = payload.exportedAt.slice(0, 10);

    anchor.href = url;
    anchor.download = `${this.filePrefix}-${datePart}.json`;
    anchor.click();

    window.URL.revokeObjectURL(url);
  }

  importFromJsonText(jsonText: string): { ok: true } | { ok: false; error: string } {
    if (!this.isBrowser()) {
      return { ok: false, error: 'Importacion disponible solo en navegador.' };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return { ok: false, error: 'El fichero no contiene un JSON valido.' };
    }

    const payload = this.parseAndValidatePayload(parsed);
    if (!payload.ok) {
      return payload;
    }

    try {
      window.localStorage.clear();
      Object.entries(payload.value.data).forEach(([key, value]) => {
        window.localStorage.setItem(key, value);
      });
    } catch {
      return { ok: false, error: 'No se pudo sobrescribir el storage del navegador.' };
    }

    return { ok: true };
  }

  private getAllStorageEntries(): Record<string, string> {
    const data: Record<string, string> = {};
    const storage = window.localStorage;

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      const value = storage.getItem(key);
      if (value === null) {
        continue;
      }

      data[key] = value;
    }

    return data;
  }

  private parseAndValidatePayload(parsed: unknown):
    | { ok: true; value: StorageExportPayload }
    | { ok: false; error: string } {
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'La estructura del JSON no es valida.' };
    }

    const payload = parsed as Partial<StorageExportPayload>;

    if (payload.format !== 'taxspain-storage-export' || payload.version !== 1) {
      return { ok: false, error: 'El JSON no tiene el formato de exportacion esperado.' };
    }

    if (typeof payload.exportedAt !== 'string') {
      return { ok: false, error: 'Falta el campo exportedAt en formato texto.' };
    }

    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      return { ok: false, error: 'El campo data del JSON no es valido.' };
    }

    for (const [key, value] of Object.entries(payload.data)) {
      if (typeof key !== 'string' || typeof value !== 'string') {
        return { ok: false, error: 'Todas las entradas de data deben ser pares string-string.' };
      }
    }

    return {
      ok: true,
      value: payload as StorageExportPayload
    };
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}