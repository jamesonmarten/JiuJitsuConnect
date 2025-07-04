import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  filters: {
    search: string;
    location: string;
    role: string;
    skillLevel: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      location: "all",
      role: "all",
      skillLevel: "all",
    });
  };

  return (
    <Card className="search-filters">
      <CardHeader>
        <CardTitle className="text-lg">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search by name</Label>
          <Input
            id="search"
            placeholder="Enter name..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
        
        <div>
          <Label>Location</Label>
          <Select value={filters.location} onValueChange={(value) => handleChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="longwood">Longwood</SelectItem>
              <SelectItem value="orlando">Orlando</SelectItem>
              <SelectItem value="winter-park">Winter Park</SelectItem>
              <SelectItem value="lake-mary">Lake Mary</SelectItem>
              <SelectItem value="altamonte">Altamonte Springs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Role</Label>
          <Select value={filters.role} onValueChange={(value) => handleChange("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Skill Level</Label>
          <Select value={filters.skillLevel} onValueChange={(value) => handleChange("skillLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => onFilterChange(filters)}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
