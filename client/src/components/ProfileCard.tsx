import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import StarRating from "./StarRating";
import { UserWithProfile } from "@shared/schema";

interface ProfileCardProps {
  user: UserWithProfile;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="profile-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
            alt={`${user.firstName} ${user.lastName}`}
            className="profile-avatar"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {user.firstName} {user.lastName}
            </h3>
            {user.profile && (
              <div className="flex gap-2 mb-2">
                <Badge className="badge-role">{user.profile.role}</Badge>
                <Badge className="badge-skill">{user.profile.skillLevel}</Badge>
              </div>
            )}
          </div>
        </div>

        {user.profile?.gymAffiliation && (
          <div className="mb-3">
            <span className="gym-badge">{user.profile.gymAffiliation}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 location-pin" />
            {user.profile?.location || 'Unknown'}
          </div>
          {user.averageRating && (
            <div className="flex items-center gap-1">
              <StarRating rating={user.averageRating} readonly size="sm" />
              <span className="text-sm text-muted-foreground">
                ({user.ratingCount})
              </span>
            </div>
          )}
        </div>

        <Link href={`/profile/${user.id}`}>
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
