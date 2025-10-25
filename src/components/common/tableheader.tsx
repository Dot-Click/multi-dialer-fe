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
// import {
//   CalendarComponent,
//   type CalendarComponentProps,
// } from "../ui/calendarcomponent";
import { useGlobalTable } from "../../providers/table.provider";
import { DebouncedInput } from "../common/tablecomponent";
import type { Table } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import type { PropsWithChildren } from "react";
import { Filter } from "lucide-react";
import { Flex } from "../ui/flex";
interface TableHeaderFnProps<T> {
  //   extends
  //   Pick<CalendarComponentProps, "onApply" | "onReset">
  //   withCalendarFilter?: boolean;
  withColumnFilter?: boolean;
  table: Table<T>;
}
type TableHeaderFn = <T>(
  FnProps: TableHeaderFnProps<T> & PropsWithChildren
) => React.ReactNode;
export const TableHeader: TableHeaderFn = ({
  //   withCalendarFilter = true,
  withColumnFilter = true,
  children,
  table,
}) => {
  const { globalFilter, setGlobalFilter } = useGlobalTable();
  return (
    <Flex className="justify-between py-4 max-md:flex-col items-start">
      <DebouncedInput
        value={globalFilter}
        onChange={(value) => setGlobalFilter(value)}
      />
      <Flex className="max-md:w-full">
        {/* {withCalendarFilter && <CalendarComponent />} */}
        {withColumnFilter && (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                      <Filter />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-0.5">
                  <p>Filter Table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
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
};
