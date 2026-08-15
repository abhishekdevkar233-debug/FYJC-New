import { SubItemList } from "../../components/ui/SubItemList";

export function CapAdmissionPage() {
  return (
    <SubItemList
      title="CAP Admission"
      description="Track your seat allotment across every CAP round."
      items={[
        {
          name: "CAP Allotment Status",
          description: "Check your allotted college for a selected round.",
          tag: "Round 1",
        },
        {
          name: "CAP Admission Summary",
          description: "Zero Round through Special Round-5 — not allotted yet.",
          tag: "9 Rounds",
        },
      ]}
    />
  );
}
