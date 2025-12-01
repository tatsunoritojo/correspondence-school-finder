import { DiagnosisResult, ParentChildData } from "../types";

const STORAGE_PREFIX = "csf_diagnosis_";

export const LocalStorageRepository = {
  /**
   * Save diagnosis result for a specific child ID.
   * If role is child, overwrites/creates the record.
   * If role is parent, appends to the existing record.
   */
  async saveResult(childId: string, result: DiagnosisResult): Promise<void> {
    const key = `${STORAGE_PREFIX}${childId}`;
    
    // Simulate async IO for future API compatibility
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const existingStr = localStorage.getItem(key);
      const data: ParentChildData = existingStr ? JSON.parse(existingStr) : { child: null, parent: null };

      if (result.role === "child") {
        data.child = result;
      } else {
        data.parent = result;
      }

      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save result", e);
      throw e;
    }
  },

  /**
   * Load the full parent-child data structure.
   */
  async loadData(childId: string): Promise<ParentChildData> {
    const key = `${STORAGE_PREFIX}${childId}`;
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const str = localStorage.getItem(key);
    if (!str) return { child: null, parent: null };
    
    try {
      return JSON.parse(str);
    } catch (e) {
      return { child: null, parent: null };
    }
  }
};
