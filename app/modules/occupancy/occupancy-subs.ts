type StreamController = ReadableStreamDefaultController<Uint8Array>;

const globalForListeners = globalThis as typeof globalThis & {
    occupancyListeners?: Map<string, Set<StreamController>>;
};

const listeners = globalForListeners.occupancyListeners ?? new Map<string, Set<StreamController>>();
globalForListeners.occupancyListeners = listeners;

export function addListener(familyId: string, controller: StreamController) {
    if (!listeners.has(familyId)) {
        listeners.set(familyId, new Set());
    }
    listeners.get(familyId)!.add(controller);
}

export function removeListener(familyId: string, controller: StreamController) {
    listeners.get(familyId)?.delete(controller);
}

export function notifyFamily(familyId: string) {
    const encoder = new TextEncoder();
    const payload = encoder.encode("data: hello\n\n");
    for (const controller of listeners.get(familyId) ?? []) {
        try {
            controller.enqueue(payload);
        } catch {
            listeners.get(familyId)?.delete(controller);
        }
    }
}
