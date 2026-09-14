import { Plus } from "lucide-react";
import { ListsView } from "@/components/lists-view";
import { Button, PageHeader } from "@/components/ui";

export default function ListsPage() {
  return <div className="fade-up"><PageHeader title="Lists" description="Group wallets and monitor their combined activity." actions={<Button><Plus className="h-3.5 w-3.5" />New list</Button>} /><ListsView /></div>;
}
