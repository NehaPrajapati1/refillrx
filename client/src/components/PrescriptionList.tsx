import type { Prescription } from "../types";
import PrescriptionCard from "./PrescriptionCard";
import { useState } from "react";
import { useEffect } from "react";
import { apiFetch } from "../api";

export default function PrescriptionList() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Prescription[]>("/prescriptions", "alex@example.com").then((data) => {
            setPrescriptions(data);
        }).catch((err) => {
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p className="status">Loading prescriptions…</p>;
    }

    if (error) {
        return <p className="status error">Error: {error}</p>;
    }

    if (prescriptions.length === 0) {
        return <p className="status">No prescriptions yet.</p>;
    }

    const runningLowCount = prescriptions.filter((p) => p.runningLow).length;

    return (
         <section>
            {runningLowCount > 0 && (
                <div className="alert">
                ⚠️ {runningLowCount} {runningLowCount === 1 ? "medication is" : "medications are"} running low
                </div>
            )}
            <div className="grid">
            {prescriptions.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
            </div>
        </section>
    );
}