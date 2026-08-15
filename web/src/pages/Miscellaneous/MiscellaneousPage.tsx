import { SubItemList } from "../../components/ui/SubItemList";

export function MiscellaneousPage() {
  return (
    <SubItemList
      title="Miscellaneous"
      description="Payment history, grievances and other account utilities."
      items={[
        {
          name: "Payment History",
          description: "1 successful transaction of ₹100 via UPI.",
          tag: "View",
        },
        {
          name: "Grievance",
          description: "1 pending, 1 resolved ticket on file.",
          tag: "2 Tickets",
        },
        {
          name: "Withdraw Application",
          description: "Withdraw your Std. XI admission application.",
          tag: "Disabled",
        },
      ]}
    />
  );
}
