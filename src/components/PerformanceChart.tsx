
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceChart() {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Prestaties over tijd
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
          [Grafiek komt hier]
        </div>
      </CardContent>
    </Card>
  );
}
