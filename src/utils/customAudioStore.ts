// Custom Audio Store Utility
// Uses IndexedDB with in-memory caching to bypass localStorage 5MB quota limits

const DB_NAME = "VuiHocAudioDB";
const STORE_NAME = "custom_audio";
const DB_VERSION = 1;
const LEGACY_STORAGE_KEY = "vui_hoc_custom_audio_map_v1";

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

// Synchronous in-memory cache for instant audio checks and playback
const memoryCache = new Map<string, string>();
let isInitialized = false;

export async function initCustomAudioStore(): Promise<void> {
  if (isInitialized) return;
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();

    await new Promise<void>((resolve) => {
      request.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          memoryCache.set(String(cursor.key), String(cursor.value));
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => resolve();
    });

    // Auto-migrate from legacy localStorage to IndexedDB
    try {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyMap = JSON.parse(legacyRaw);
        const writeTx = db.transaction(STORE_NAME, "readwrite");
        const writeStore = writeTx.objectStore(STORE_NAME);
        for (const [key, val] of Object.entries(legacyMap)) {
          if (typeof val === "string" && val.length > 0) {
            memoryCache.set(key, val);
            writeStore.put(val, key);
          }
        }
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Legacy audio migration notice:", err);
    }

    // Fetch persistent custom audio from server backend
    try {
      const res = await fetch("/api/custom-audio");
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData === "object") {
          const writeTx = db.transaction(STORE_NAME, "readwrite");
          const writeStore = writeTx.objectStore(STORE_NAME);
          for (const [key, val] of Object.entries(serverData)) {
            if (typeof val === "string" && val.length > 0) {
              memoryCache.set(key, val);
              writeStore.put(val, key);
            }
          }
        }
      }
    } catch (netErr) {
      console.warn("Server audio sync notice:", netErr);
    }

    isInitialized = true;
  } catch (err) {
    console.error("IndexedDB audio store initialization error", err);
    isInitialized = true;
  }
}

if (typeof window !== "undefined") {
  initCustomAudioStore();
}

export const getAudioKeyCandidates = (itemId: string): string[] => {
  const candidates: string[] = [itemId];

  let raw = itemId;
  if (raw.startsWith("comp-")) raw = raw.slice(5);
  else if (raw.startsWith("compound-")) raw = raw.slice(9);
  else if (raw.startsWith("letter-")) raw = raw.slice(7);
  else if (raw.startsWith("rhyme-")) raw = raw.slice(6);
  else if (raw.startsWith("am-")) raw = raw.slice(3);
  else if (raw.startsWith("tone-")) raw = raw.slice(5);

  let codeOnly = raw;
  if (codeOnly.startsWith("c-")) codeOnly = codeOnly.slice(2);
  else if (codeOnly.startsWith("l-")) codeOnly = codeOnly.slice(2);
  else if (codeOnly.startsWith("rhyme-")) codeOnly = codeOnly.slice(6);

  if (raw && raw !== itemId) candidates.push(raw);
  if (codeOnly && codeOnly !== raw && codeOnly !== itemId) candidates.push(codeOnly);

  // Tone mark specific alias matching
  const TONE_ALIASES: Record<string, string[]> = {
    "huyen": ["tone-huyen", "am-̀", "̀", "`", "huyen", "dấu huyền", "tone-̀"],
    "sac": ["tone-sac", "am-́", "́", "´", "sac", "dấu sắc", "tone-́"],
    "hoi": ["tone-hoi", "am-̉", "̉", "?", "hoi", "dấu hỏi", "tone-̉"],
    "nga": ["tone-nga", "am-̃", "̃", "~", "nga", "dấu ngã", "tone-̃"],
    "nang": ["tone-nang", "am-̣", "̣", ".", "nang", "dấu nặng", "tone-̣"],
    "̀": ["tone-huyen", "am-̀", "̀", "`", "huyen", "dấu huyền", "tone-̀"],
    "́": ["tone-sac", "am-́", "́", "´", "sac", "dấu sắc", "tone-́"],
    "̉": ["tone-hoi", "am-̉", "̉", "?", "hoi", "dấu hỏi", "tone-̉"],
    "̃": ["tone-nga", "am-̃", "̃", "~", "nga", "dấu ngã", "tone-̃"],
    "̣": ["tone-nang", "am-̣", "̣", ".", "nang", "dấu nặng", "tone-̣"],
  };

  if (TONE_ALIASES[raw] || TONE_ALIASES[codeOnly] || TONE_ALIASES[itemId]) {
    const list = TONE_ALIASES[raw] || TONE_ALIASES[codeOnly] || TONE_ALIASES[itemId];
    candidates.push(...list);
  }

  if (codeOnly) {
    candidates.push(`comp-c-${codeOnly}`);
    candidates.push(`compound-c-${codeOnly}`);
    candidates.push(`comp-${codeOnly}`);
    candidates.push(`compound-${codeOnly}`);
    candidates.push(`letter-l-${codeOnly}`);
    candidates.push(`letter-${codeOnly}`);
    candidates.push(`rhyme-rhyme-${codeOnly}`);
    candidates.push(`rhyme-${codeOnly}`);
    candidates.push(`c-${codeOnly}`);
    candidates.push(`l-${codeOnly}`);
    candidates.push(`am-${codeOnly}`);
    candidates.push(`tone-${codeOnly}`);
  }

  return Array.from(new Set(candidates));
};

export const getCustomAudio = (itemId: string): string | null => {
  const candidates = getAudioKeyCandidates(itemId);
  for (const cand of candidates) {
    if (memoryCache.has(cand)) {
      return memoryCache.get(cand) || null;
    }
  }
  return null;
};

export const hasCustomAudio = (itemId: string): boolean => {
  return !!getCustomAudio(itemId);
};

export const saveCustomAudio = async (itemId: string, dataUrl: string): Promise<boolean> => {
  const candidates = getAudioKeyCandidates(itemId);
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const cand of candidates) {
      memoryCache.set(cand, dataUrl);
      store.put(dataUrl, cand);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to save custom audio to IndexedDB", e);
    for (const cand of candidates) {
      memoryCache.set(cand, dataUrl);
    }
  }

  // Send to server for persistent storage across deployments
  try {
    await fetch("/api/custom-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, dataUrl, candidates }),
    });
  } catch (netErr) {
    console.warn("Failed to save audio to server:", netErr);
  }

  return true;
};

export const removeCustomAudio = async (itemId: string): Promise<void> => {
  const candidates = getAudioKeyCandidates(itemId);
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const cand of candidates) {
      memoryCache.delete(cand);
      store.delete(cand);
    }
  } catch (e) {
    console.error("Failed to remove custom audio", e);
    for (const cand of candidates) {
      memoryCache.delete(cand);
    }
  }

  // Delete from server
  try {
    await fetch(`/api/custom-audio/${encodeURIComponent(itemId)}?candidates=${encodeURIComponent(candidates.join(","))}`, {
      method: "DELETE",
    });
  } catch (netErr) {
    console.warn("Failed to delete audio from server:", netErr);
  }
};

let currentPlayingAudio: HTMLAudioElement | null = null;

export const stopAllAudio = () => {
  if (currentPlayingAudio) {
    currentPlayingAudio.pause();
    currentPlayingAudio.currentTime = 0;
    currentPlayingAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Plays audio for an item:
 * 1. If custom recorded/uploaded audio exists, plays the custom audio data URL.
 * 2. Otherwise falls back to Web SpeechSynthesisUtterance.
 */
export const playItemAudio = (
  itemId: string,
  defaultText: string,
  onStart?: () => void,
  onEnd?: () => void
) => {
  stopAllAudio();

  const customDataUrl = getCustomAudio(itemId);

  if (customDataUrl) {
    try {
      if (onStart) onStart();
      const audio = new Audio(customDataUrl);
      currentPlayingAudio = audio;

      audio.onended = () => {
        currentPlayingAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        console.warn("Error playing custom audio, falling back to TTS");
        fallbackTTS(defaultText, onStart, onEnd);
      };

      audio.play().catch(err => {
        console.warn("Audio play blocked/failed", err);
        fallbackTTS(defaultText, onStart, onEnd);
      });
      return;
    } catch (e) {
      console.error("Audio playback error", e);
    }
  }

  // Fallback to default TTS
  fallbackTTS(defaultText, onStart, onEnd);
};

const fallbackTTS = (text: string, onStart?: () => void, onEnd?: () => void) => {
  if ('speechSynthesis' in window) {
    if (onStart) onStart();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    
    // Safety timeout in case onend doesn't fire
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 2500);
  } else {
    if (onEnd) onEnd();
  }
};

/**
 * Export all recorded audio into a JSON string or triggers a file download
 */
export const exportAudioPackage = (): string => {
  const exportMap: Record<string, string> = {};
  memoryCache.forEach((val, key) => {
    exportMap[key] = val;
  });
  return JSON.stringify(exportMap, null, 2);
};

export const downloadAudioPackageFile = (filename = "vui_hoc_giong_doc_mau.json") => {
  const jsonStr = exportAudioPackage();
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Import recorded audio package from JSON string into IndexedDB & memoryCache
 */
export const importAudioPackage = async (jsonContent: string): Promise<number> => {
  try {
    const data = JSON.parse(jsonContent);
    if (!data || typeof data !== "object") return 0;

    let count = 0;
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const [key, val] of Object.entries(data)) {
      if (typeof val === "string" && val.length > 0) {
        memoryCache.set(key, val);
        store.put(val, key);
        count++;
      }
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Send batch to server for permanent persistence
    try {
      await fetch("/api/custom-audio/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonContent,
      });
    } catch (netErr) {
      console.warn("Failed to sync imported audio batch to server:", netErr);
    }

    return count;
  } catch (err) {
    console.error("Failed to import audio package", err);
    return 0;
  }
};

export const getAllAudioCount = (): number => {
  return memoryCache.size;
};

