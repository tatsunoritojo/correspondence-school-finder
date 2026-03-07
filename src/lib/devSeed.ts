import type { ParentChildData, AnswerMap, AxisId } from "../types";

const DEV_CHILD_ID = "dev-test-000";

const dummyScores: Record<AxisId, number> = {
    AX01: 3.8,
    AX02: 2.4,
    AX03: 4.2,
    AX04: 4.5,
    AX05: 3.0,
    AX06: 2.1,
    AX07: 4.8,
    AX08: 1.9,
};

const dummyAnswers: AnswerMap = {
    "Q0-1": ["AX04", "AX07"],
    "Q1-1": 4, "Q1-2": 4,
    "Q2-1": 2, "Q2-2": 3,
    "Q3-1": 5, "Q3-2": 4,
    "Q4-1": 5, "Q4-2": 4,
    "Q5-1": 3, "Q5-2": 3,
    "Q6-1": 2, "Q6-2": 2,
    "Q7-1": 5, "Q7-2": 5,
    "Q8-1": 2, "Q8-2": 2,
    "Q9-1": "30min",
    "Q10-1": ["essay", "interview"],
    "Q11-1": ["walk_bike", "public_transit"],
    "Q12-1": ["morning_ok", "afternoon_better"],
};

/**
 * Seed localStorage with dummy diagnosis data and return the URL to navigate to.
 * Call with role="both" to also seed parent data for parent-child matching view.
 */
export function seedDevData(role: "child" | "parent" | "both" = "child"): string {
    const now = Date.now();

    const childResult = {
        role: "child" as const,
        answers: dummyAnswers,
        knockoutAnswers: ["AX04", "AX07"] as AxisId[],
        scores: dummyScores,
        timestamp: now,
    };

    const parentScores: Record<AxisId, number> = {
        AX01: 2.5,
        AX02: 4.0,
        AX03: 3.5,
        AX04: 3.2,
        AX05: 4.5,
        AX06: 3.8,
        AX07: 3.0,
        AX08: 2.0,
    };

    const parentResult = {
        role: "parent" as const,
        answers: dummyAnswers,
        knockoutAnswers: ["AX02", "AX05"] as AxisId[],
        scores: parentScores,
        timestamp: now,
    };

    const data: ParentChildData = {
        child: childResult,
        parent: role === "both" ? parentResult : null,
    };

    localStorage.setItem(`csf_diagnosis_${DEV_CHILD_ID}`, JSON.stringify(data));

    // Clear form status so consent banner is visible
    localStorage.removeItem("csf-form-status");

    const viewRole = role === "both" ? "child" : role;
    return `/result?child_id=${DEV_CHILD_ID}&role=${viewRole}`;
}
