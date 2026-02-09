"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, change, trend, icon: Icon }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div
            className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              trend === "up" ? "text-green-600 bg-green-50" : trend === "down" ? "text-red-600 bg-red-50" : "text-slate-600 bg-slate-50"
            )}
          >
            {trend === "up" && <ArrowUpRight className="w-3 h-3 mr-1" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend === "neutral" && <Minus className="w-3 h-3 mr-1" />}
            {change}
          </div>
        </div>
        <div>
          <h3 className="font-display font-bold text-3xl text-slate-900 mb-1">{value}</h3>
          <p className="text-sm font-medium text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
