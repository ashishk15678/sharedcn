import EntityPage from "@/components/entity-componnets";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <>
      <div className="h-full w-full relative">
        <EntityPage
          title="Your components"
          description="All the components that you have created so far will be listed below."
          type="components"
        />
        <Separator />

        <EntityPage
          title="Your Setups"
          description="All the setups that you have created so far will be listed below."
          type="setups"
        />
      </div>
    </>
  );
}
