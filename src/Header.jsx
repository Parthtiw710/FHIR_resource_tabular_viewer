import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Filter, SlidersHorizontal, X, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = ({
  onSearchChange,
  onRefresh,
  searchTerm = "",
  onToggleFilters,
  hasActiveFilters,
  onClearFilters
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (onSearchChange) onSearchChange(localSearchTerm);
  };

  const currentDateTime = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b bg-background/90 backdrop-blur-sm">

        <div className="space-y-1">

          <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-none">
            FHIR Patient Viewer
          </h1>

          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            Healthcare Data Management System
          </p>

        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 sm:mt-0 bg-muted/60 px-3 py-1.5 rounded-md border">
          <CalendarClock className="h-4 w-4 opacity-70" />
          <span className="font-medium">{currentDateTime}</span>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-3 border-b bg-card/50">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Button
            onClick={onToggleFilters}
            variant="destructive"
            className="flex items-center shadow-sm font-semibold"
          >
            <Filter className="w-4 h-4 mr-2" />
            Quick Filters
            {hasActiveFilters && (
              <span 
                className="ml-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors cursor-pointer"
                onClick={(e) => {
                  console.log("Quick Filters Clear clicked!");
                  e.preventDefault();
                  e.stopPropagation();
                  if (onClearFilters) onClearFilters();
                }}
                title="Clear active filters"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </span>
            )}
          </Button>
          <h2 className="text-lg font-semibold text-foreground tracking-tight hidden md:block">
            FHIR Resource Viewer - Patient Search
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => onRefresh ? onRefresh() : window.location.reload()}
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-muted/30">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-2xl gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search patients by name or ID..."
              className="pl-9 h-10 w-full bg-background shadow-sm border-muted-foreground/20 focus-visible:ring-blue-500"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => { setLocalSearchTerm(""); if (onSearchChange) onSearchChange(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className={`h-10 ml-2 hidden sm:flex items-center shadow-sm border-muted-foreground/20 transition-all ${hasActiveFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-background"}`}
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className={`w-4 h-4 mr-2 ${hasActiveFilters ? "text-blue-600" : ""}`} />
            Advanced
            {hasActiveFilters && (
              <span 
                className="ml-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors cursor-pointer"
                onClick={(e) => {
                  console.log("Advanced Filters Clear clicked!");
                  e.preventDefault();
                  e.stopPropagation();
                  if (onClearFilters) onClearFilters();
                }}
                title="Clear active filters"
              >
                <X className="w-3.5 h-3.5 text-blue-800" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
