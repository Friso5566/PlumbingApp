import { AVAILABLE_REGIONS } from "../../../drizzle/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export function RegionSelector() {
  const [currentRegion, setCurrentRegion] = useState<string>("universal");
  const [isLoading, setIsLoading] = useState(true);

  const getRegionQuery = trpc.plumbing.getRegion.useQuery();
  const setRegionMutation = trpc.plumbing.setRegion.useMutation();

  useEffect(() => {
    if (getRegionQuery.data) {
      setCurrentRegion(getRegionQuery.data.region);
      setIsLoading(false);
    }
  }, [getRegionQuery.data]);

  const handleRegionChange = async (region: string) => {
    setCurrentRegion(region);
    await setRegionMutation.mutateAsync({ region });
  };

  const currentRegionName =
    AVAILABLE_REGIONS.find((r: any) => r.code === currentRegion)?.name || "Universal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">{currentRegionName}</span>
          <span className="sm:hidden text-xs">{currentRegion}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AVAILABLE_REGIONS.map((region: any) => (
          <DropdownMenuItem
            key={region.code}
            onClick={() => handleRegionChange(region.code)}
            className={currentRegion === region.code ? "bg-blue-50" : ""}
          >
            <div className="flex items-center gap-2 w-full">
              {currentRegion === region.code && (
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              )}
              <span className="flex-1">{region.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
