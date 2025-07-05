import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Users } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Card className="w-full max-w-lg mx-4 shadow-xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Home className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">
              Looks like you've ventured into uncharted territory. Let's get you back to the action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Find Fighters
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}