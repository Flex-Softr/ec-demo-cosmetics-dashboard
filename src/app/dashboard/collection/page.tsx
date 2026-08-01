import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";
import CollectionForm from "./components/CollectionForm";
import CollectionTable from "./components/CollectionTable";

export default function CollectionPage() {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Collections"
        subtitle="Manage product collections and groupings"
        icon={Layers}
        actions={
          <CollectionForm
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Collection</span>
              </Button>
            }
          />
        }
      />
      <ContentCard>
        <CollectionTable />
      </ContentCard>
    </div>
  );
}
