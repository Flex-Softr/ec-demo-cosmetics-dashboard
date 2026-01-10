import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CollectionForm from "./components/CollectionForm";
import CollectionTable from "./components/CollectionTable";

export default function CollectionPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
        <CollectionForm
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          }
        />
      </div>

      <CollectionTable />
    </div>
  );
}
