import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useGlobalTable } from "../../providers/table.provider";
import { DebouncedInput } from "./tablecomponent";
// 'Table' اور 'Column' کی اقسام کو @tanstack/react-table سے امپورٹ کریں
import type { Table, Column } from "@tanstack/react-table";
import { Button } from "../ui/button";
import type { PropsWithChildren } from "react";
import { Filter } from "lucide-react";
import { Flex } from "../ui/flex";

// پروپس کے لیے ایک انٹرفیس بنائیں
interface TableHeaderProps<TData> {
  withColumnFilter?: boolean;
  table: Table<TData>;
}

// کمپوننٹ کو ایک جنرک فنکشن کے طور پر واضح کریں
export function TableHeader<TData extends object>({
  withColumnFilter = true,
  children,
  table,
}: PropsWithChildren<TableHeaderProps<TData>>) {
  // useGlobalTable کو بھی جنرک قسم فراہم کریں
  const { globalFilter, setGlobalFilter } = useGlobalTable<TData>();

  return (
    <Flex className="justify-between py-4 max-md:flex-col items-start">
      <DebouncedInput
        // یقینی بنائیں کہ ویلیو کبھی undefined نہ ہو
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
      />
      <Flex className="max-md:w-full">
        {withColumnFilter && (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-0.5">
                  <p>Filter Table Columns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                // 'column' کی قسم کو واضح کریں
                .filter((column: Column<TData, unknown>) => column.getCanHide())
                .map((column: Column<TData, unknown>) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {children}
      </Flex>
    </Flex>
  );
}



