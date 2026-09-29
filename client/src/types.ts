export type Role = "patient" | "staff";

export type RefillStatus = "requested" | "approved" | "packed" | "shipped" | "delivered"

export interface Prescription {
    id : number,
    userId : number,
    medicationName : string,
    dosage: string,
    quantity: number,
    timesPerDay : number,
    refillsRemaining : number,
    pharmacyName: string,
    lastFilledDate: string,
    daysRemaining : number,
    runningLow: boolean
}

export interface DemoUser {
    email: string;
    label: string;
}
