import { DiagnosticResult } from '../types';

const STORAGE_PREFIX = 'correspondence_finder_';

export function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function saveChildResult(result: DiagnosticResult): string {
    const id = generateUUID();
    const key = `${STORAGE_PREFIX}child_${id}`;
    localStorage.setItem(key, JSON.stringify(result));
    return id;
}

export function loadChildResult(id: string): DiagnosticResult | null {
    const key = `${STORAGE_PREFIX}child_${id}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
        return JSON.parse(data) as DiagnosticResult;
    } catch (e) {
        console.error('Failed to parse child result', e);
        return null;
    }
}

export function saveLocalProgress(result: DiagnosticResult) {
    localStorage.setItem(`${STORAGE_PREFIX}current_progress`, JSON.stringify(result));
}

export function loadLocalProgress(): DiagnosticResult | null {
    const data = localStorage.getItem(`${STORAGE_PREFIX}current_progress`);
    if (!data) return null;
    try {
        return JSON.parse(data) as DiagnosticResult;
    } catch (e) {
        return null;
    }
}
