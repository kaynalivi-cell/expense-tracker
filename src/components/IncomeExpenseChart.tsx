"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { getTotalIncome, getTotalExpenses } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

export function IncomeExpenseChart() {
  const transactions = useExpenseStore((state) => state.transactions);

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);

  // Dados para o gráfico
  const chartData = [
    {
      name: "Receitas",
      valor: totalIncome,
      fill: "#22c55e", // green-500
    },
    {
      name: "Despesas",
      valor: totalExpenses,
      fill: "#ef4444", // red-500
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm mb-1">{data.payload.name}</p>
          <p
            className={`text-sm font-bold ${
              data.payload.name === "Receitas"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label para mostrar valores nas barras
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#64748b"
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {formatCurrency(value)}
      </text>
    );
  };

  if (totalIncome === 0 && totalExpenses === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Receitas vs Despesas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">
            Nenhuma transação registrada ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Receitas vs Despesas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              tick={{ fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickFormatter={(value) => {
                // Formatar valores do eixo Y de forma compacta
                if (value >= 1000) {
                  return `R$ ${(value / 1000).toFixed(1)}k`;
                }
                return `R$ ${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value, entry: any) => entry.payload.name}
            />
            <Bar
              dataKey="valor"
              fill="#8884d8"
              radius={[8, 8, 0, 0]}
              label={renderCustomLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Informação adicional */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Saldo:</span>
            <span
              className={`font-bold ${
                totalIncome - totalExpenses >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totalIncome - totalExpenses)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
