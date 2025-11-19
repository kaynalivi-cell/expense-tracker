"use client";

import { Category, TransactionType } from "@/types/transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

export type FilterType = "all" | TransactionType;
export type PeriodType = "today" | "week" | "month" | "all";

interface FilterBarProps {
  filterType: FilterType;
  filterCategory: Category | "all";
  filterPeriod: PeriodType;
  onFilterTypeChange: (type: FilterType) => void;
  onFilterCategoryChange: (category: Category | "all") => void;
  onFilterPeriodChange: (period: PeriodType) => void;
}

const categories: (Category | "all")[] = [
  "all",
  "Alimentação",
  "Transporte",
  "Moradia",
  "Contas",
  "Lazer",
  "Salário",
  "Outros",
];

export function FilterBar({
  filterType,
  filterCategory,
  filterPeriod,
  onFilterTypeChange,
  onFilterCategoryChange,
  onFilterPeriodChange,
}: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          {/* Filtro por tipo */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-type" className="text-sm text-muted-foreground">
              Tipo:
            </label>
            <Select value={filterType} onValueChange={onFilterTypeChange}>
              <SelectTrigger id="filter-type" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por categoria */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-category" className="text-sm text-muted-foreground">
              Categoria:
            </label>
            <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
              <SelectTrigger id="filter-category" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Todas" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por período */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-period" className="text-sm text-muted-foreground">
              Período:
            </label>
            <Select value={filterPeriod} onValueChange={onFilterPeriodChange}>
              <SelectTrigger id="filter-period" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
