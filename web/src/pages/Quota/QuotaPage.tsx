import { SubItemList } from "../../components/ui/SubItemList";

export function QuotaPage() {
  return (
    <SubItemList
      title="Quota Choices (Part II)"
      description="Apply separately for In-House, Minority or Management quota seats."
      items={[
        {
          name: "Apply for In-House Quota",
          description: "Select Junior Colleges under the In-House quota category.",
          tag: "Disabled",
        },
        {
          name: "Apply for Minority Quota",
          description: "1 college selected under Minority quota.",
          tag: "1 Saved",
        },
        {
          name: "Apply for Management Quota",
          description: "1 college selected under Management quota.",
          tag: "Disabled",
        },
      ]}
    />
  );
}
