import { SubItemList } from "../../components/ui/SubItemList";

export function CapOptionPage() {
  return (
    <SubItemList
      title="CAP Option (Part II)"
      description="Choose your stream, medium and preferred Junior Colleges."
      items={[
        {
          name: "Choose Stream & Medium",
          description: "Select Arts, Commerce or Science and the medium of instruction.",
          tag: "Round 7",
        },
        {
          name: "Choose Jr. Colleges",
          description: "Search and rank up to 10 Junior Colleges as your preferences.",
          tag: "Round 7",
        },
        {
          name: "Lock Option Form",
          description: "Review and lock your Part-II college preferences.",
          tag: "Locked",
        },
      ]}
    />
  );
}
