"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarGraphProps {
  chartData: { date: string; count: number }[];
  title : string;
  desc : string;
}

const chartConfig = {
  views: {
    label: "Page Views",
  },
  count: {
    label: "Count",
    color: "blue",
  },
} satisfies ChartConfig;

export function TransactionChart({ chartData, title, desc }: BarGraphProps) {
  const [activeChart, setActiveChart] =
      React.useState<keyof typeof chartConfig>("count");

  const total = React.useMemo(
      () => ({
        count: chartData.reduce((acc, curr) => acc + curr.count, 0),
      }),
      [chartData]
  );

  return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </div>
          <div className="flex">
            <button
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            >
            <span className="text-xs text-muted-foreground">
              {chartConfig.count.label}
            </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.count.toLocaleString()}
            </span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[280px] w-full"
          >
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
              />
              <ChartTooltip
                  content={
                    <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                    />
                  }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
  );
}