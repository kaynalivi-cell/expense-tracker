"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { getTransactionsByCategory } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

// Cores para cada categoria
const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#ef4444", // red-500
  Transporte: "#f59e0b", // amber-500
  Moradia: "#8b5cf6", // violet-500
  Contas: "#ec4899", // pink-500
  Lazer: "#14b8a6", // teal-500
  Salário: "#22c55e", // green-500
  Outros: "#6b7280", // gray-500
};

export function CategoryChart() {
  const transactions = useExpenseStore((state) => state.transactions);

  // Filtrar apenas despesas
  const expenses = transactions.filter((t) => t.type === "expense");
  const categoryData = getTransactionsByCategory(expenses);

  // Transformar dados para o formato do Recharts
  const chartData = Object.entries(categoryData)
    .filter(([_, value]) => value > 0) // Apenas categorias com valores
    .map(([category, value]) => ({
      name: category,
      value: value,
      percentage: 0, // Será calculado depois
    }));

  // Calcular total e percentuais
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach((item) => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm mb-1">{data.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data.percentage.toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label para mostrar percentual
  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage.toFixed(0)}%`;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Despesas por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">
            Nenhuma despesa registrada ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Despesas por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                return `${value} (${formatCurrency(entry.payload.value)})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
