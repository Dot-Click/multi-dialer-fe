import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  Search,
  AlertCircleIcon,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import {
  flexRender,
} from "@tanstack/react-table";
import type {
  Header,
  CellContext,
  HeaderContext,
} from "@tanstack/table-core";

import { useDebounceCallback, useIntersectionObserver } from "usehooks-ts";
import { forwardRef, useEffect, useState, memo, type FC } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { useGlobalTable } from "@/providers/table.provider";
import { Tooltip, type ITooltip } from "react-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { PiCaretUpDownFill } from "react-icons/pi";
import { Flex } from "@/components/ui/flex";
import colors from "tailwindcss/colors";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/ui/stack";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    mobileHeader?: string;
  }
}
interface WithVirtualScroll {
  hasNextPage: boolean;
  fetchNextPage: any;
  isVirtual?: true;
}
interface WithOutVirtualScroll {
  fetchNextPage?: never;
  hasNextPage?: never;
  isVirtual?: false;
}
const TableComponent: FC<
  {
    withDoubleClickIndication?: boolean;
    withSingleClickIndication?: boolean;
    singleClickTooltipProps?: ITooltip;
    doubleClickTooltipProps?: ITooltip;
    selectedRowId?: string;
    isLoading?: boolean;
  } & (WithVirtualScroll | WithOutVirtualScroll)
> = memo(
  ({
    withDoubleClickIndication = false,
    withSingleClickIndication = false,
    doubleClickTooltipProps,
    singleClickTooltipProps,
    selectedRowId,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isVirtual,
  }) => {
    const { table, onDoubleClickHandler, onSingleClickHandler } =
      useGlobalTable();
    const { isIntersecting, ref } = useIntersectionObserver();
    useEffect(() => {
      if (isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    }, [isIntersecting, hasNextPage, fetchNextPage]);
    return (
      <>
        <Table
          className={cn("overflow-hidden text-sm", isLoading && "min-h-[50vh]")}
        >
          <TableHeader className="bg-slate-50 text-slate-700 font-semibold text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                // data-state={headerGroup..getIsSelected() && "selected"}
                className={cn(
                  "border-b border-slate-200 last:border-b-0",
                  "double-click-indicator single-click-indicator",
                  (withDoubleClickIndication || withSingleClickIndication) &&
                    "cursor-pointer"
                )}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="py-5 text-left dark:bg-slate-800 dark:text-white text-slate-700  tracking-wide px-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-visible">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, key) => (
                <TableRow
                  key={key}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-b border-slate-200 last:border-b-0",
                    "double-click-indicator single-click-indicator",
                    (withDoubleClickIndication || withSingleClickIndication) &&
                      "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={i}
                      onClick={() => {
                        if (cell.column.id !== "action") {
                          onSingleClickHandler?.(row);
                        }
                      }}
                      onDoubleClick={() => {
                        if (cell.column.id !== "action") {
                          onDoubleClickHandler?.(row);
                        }
                      }}
                      className="py-5 text-slate-700 px-5 border-0"
                    >
                      {row.id === selectedRowId ? (
                        <Skeleton className="size-full h-10" />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24">
                  <Flex className="bg-yellow-50/70 rounded-lg p-6 justify-center text-yellow-800 text-sm">
                    <AlertCircleIcon className="mr-2 h-5 w-5" />
                    <p>No data available</p>
                  </Flex>
                </TableCell>
              </TableRow>
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j} className="h-5">
                      <Skeleton className="h-4 w-full rounded bg-slate-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {isVirtual && (
              <TableRow
                ref={ref}
                hidden={!hasNextPage}
                className="[&_td:first-child]:rounded-s-xl [&_td:last-child]:rounded-e-xl"
              >
                <TableCell colSpan={99} className="bg-slate-50">
                  <Flex className="items-end justify-between">
                    <Flex>
                      <Skeleton className="size-16 rounded-md bg-slate-200" />
                      <Stack className="justify-end">
                        <Skeleton className="flex-1 max-h-5 w-20 rounded-[7px] bg-slate-200" />
                        <Skeleton className="flex-1 max-h-5 w-24 rounded-[7px] bg-slate-200" />
                      </Stack>
                    </Flex>
                    {Array(2)
                      .fill(null)
                      .map((_, key) => (
                        <Stack className="justify-end" key={key}>
                          <Skeleton className="h-16 max-h-5 w-20 rounded-[7px] bg-slate-200" />
                          <Skeleton className="h-16 max-h-5 w-24 rounded-[7px] bg-slate-200" />
                        </Stack>
                      ))}
                  </Flex>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {withSingleClickIndication && (
          <Tooltip
            anchorSelect=".single-click-indicator"
            style={{
              backgroundColor: colors.slate[800],
              borderRadius: ".70rem",
              zIndex: 20,
            }}
            {...singleClickTooltipProps}
          />
        )}
        {withDoubleClickIndication && (
          <Tooltip
            anchorSelect=".double-click-indicator"
            style={{
              backgroundColor: colors.slate[800],
              borderRadius: ".50rem",
              zIndex: 20,
            }}
            {...doubleClickTooltipProps}
          />
        )}
      </>
    );
  }
);
export const SortedHeader: FC<{ header: Header<any, any>; label: string }> = ({
  header,
  label,
}) => {
  return (
    <Flex
      className="cursor-pointer items-center text-slate-600 font-semibold capitalize w-fit"
      onClick={() => header.column.toggleSorting()}
    >
      {label}
      {{
        asc: <ArrowDownNarrowWide size={20} />,
        desc: <ArrowDownWideNarrow size={20} />,
      }[header.column.getIsSorted() as string] ?? (
        <PiCaretUpDownFill className="opacity-45" />
      )}
    </Flex>
  );
};
export const checkBoxProps = (
  params: HeaderContext<any, any> | CellContext<any, any>
) => {
  interface returnType {
    id: string;
    className: string;
    onCheckedChange: () => void;
    checked: "indeterminate" | boolean;
  }
  return {
    checked:
      "row" in params
        ? params.row.getIsSelected()
        : params.table.getIsAllPageRowsSelected()
        ? true
        : params.table.getIsSomeRowsSelected()
        ? "indeterminate"
        : false,
    onCheckedChange: () =>
      "row" in params
        ? params.row.toggleSelected()
        : params.table.toggleAllPageRowsSelected(),
    className:
      "data-[state=checked]:bg-hollywood-500 data-[state=checked]:text-web-blue border-web-checkbox-grey data-[state=checked]:border-2",
  } as returnType;
};
export interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  onChange: (value: string) => void;
  delay?: number;
  value: string;
}
export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, delay = 500, onChange, ...props }, ref) => {
    const [value, setValue] = useState(initialValue);
    const narrow = useDebounceCallback(() => onChange(value), delay);
    useEffect(() => {
      const isEmpty = !value.trim().length;
      if (isEmpty) {
        setValue(value);
        onChange(value);
      } else {
        setValue(value);
        narrow();
      }
    }, [value]);
    return (
      <Input
        className={cn("bg-white", props.className)}
        leftIcon={<Search className="text-gray-400 mx-2 size-5 " />}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        value={value}
        type="text"
        ref={ref}
        {...props}
      />
    );
  }
);
export { TableComponent };
