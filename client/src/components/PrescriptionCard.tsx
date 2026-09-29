import type { Prescription } from "../types";

type Props = {
  prescription: Prescription;
};

function formatFrequency(timesPerDay: number): string {
  if (timesPerDay === 1) return "Once a day";
  if (timesPerDay === 2) return "Twice a day";
  return `${timesPerDay} times a day`;
}

export default function PrescriptionCard({ prescription }: Props) {
  return (
    <article className={prescription.runningLow ? "card low" : "card"}>
      {prescription.runningLow && <span className="badge">Running Low</span>}

      <h3>{prescription.medicationName}</h3>
      <p className="muted">{prescription.dosage} . {formatFrequency(prescription.timesPerDay)}</p>
      <dl>
        <dt>Last filled</dt>
        <dd>{new Date(prescription.lastFilledDate).toLocaleDateString("en-CA")}</dd>
        <dt>Days remaining</dt>
        <dd>{prescription.daysRemaining}</dd>
        <dt>Quantity</dt>
        <dd>{prescription.quantity}</dd>
        <dt>Refills Remaining</dt>
        <dd>{prescription.refillsRemaining}</dd>
        <dt>Pharmacy</dt>
        <dd>{prescription.pharmacyName}</dd>
      </dl>   
    </article>
  );
}