"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {DoubleLineChartProps} from "@/types";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export function DoubleLineChart({ title, description, data, firstLineLabel, secondLineLabel, className} : DoubleLineChartProps) {

    const chartConfig = {
        firstLine: {
            label: firstLineLabel,
            color: "hsl(var(--chart-1))",
        },
        secondLine: {
            label: secondLineLabel,
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig


    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="x_axis"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="firstLine"
                type="monotone"
                stroke="var(--color-firstLine)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="secondLine"
                type="monotone"
                stroke="var(--color-secondLine)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
}
