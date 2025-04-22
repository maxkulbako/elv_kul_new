import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CalendarViewSkeleton() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between flex-wrap">
            <div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-md" />
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-olive-light rounded-lg"
                    >
                      <div className="flex items-center">
                        <Skeleton className="h-12 w-12 rounded-full mr-4" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
