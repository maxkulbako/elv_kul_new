import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Calendar,
  Video,
  Building,
  User,
  DollarSign,
} from "lucide-react";

export default function AppointmentDetailsSkeleton() {
  return (
    <>
      <div className="mb-6">
        <div className="text-xl">
          <Skeleton className="h-6 w-48" />
        </div>
        <div>
          <div>
            <Skeleton className="h-4 w-64 mt-1" />
          </div>
        </div>
        <div className="mt-2">
          <Badge className="bg-gray-200 text-gray-700 border-gray-300">
            <Skeleton className="h-5 w-24" />
          </Badge>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Session Details Skeleton */}
        <div className="space-y-3">
          <div className="text-md font-medium text-gray-500">
            Session Details
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-gray-500" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Client Information Skeleton */}
        <div className="pt-2 border-t space-y-3">
          <div className="text-md font-medium text-gray-500">Client</div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>

        {/* Payment Information Skeleton */}
        <div className="pt-2 border-t space-y-3">
          <div className="text-md font-medium text-gray-500">Payment</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32 mb-1" />
                <Skeleton className="h-3 w-28 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Skeleton */}
        <div className="pt-2 border-t space-y-3">
          <div className="text-md font-medium text-gray-500">Notes</div>
          <div className="text-sm space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="w-full flex flex-col gap-4">
          <p className="text-md font-medium text-gray-500">Actions</p>
          <div className="flex flex-wrap justify-start gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
}
