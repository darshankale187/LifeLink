export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const ORGANS = ["Kidney", "Liver", "Heart", "Lung", "Pancreas", "Cornea"];

export const urgencyType = (u) => (u >= 4 ? "high" : u === 3 ? "mid" : "low");