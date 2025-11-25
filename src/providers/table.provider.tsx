import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  type FilterFn,
  type Row,
  type Table,
} from "@tanstack/table-core";

import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  useMemo,
  useState,
  type ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";

// 🔹 Extend the tanstack table-core module to include fuzzy filter support
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// 🔹 Define fuzzy filter logic
const fuzzyFilter: FilterFn<any> = (
  row: any,
  columnId: string,
  value: string,
  addMeta: any
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// 🔹 Context creation
const TableContext = createContext<TableContextType<any>>({} as any);

const useGlobalTable = <T,>() =>
  useContext(TableContext) as TableContextType<T>;

// 🔹 Base props for table context
interface BaseProps<T> {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  onDoubleClickHandler?: (row: Row<T>) => void;
  onSingleClickHandler?: (row: Row<T>) => void;
  globalFilter: string;
}

// 🔹 Context type
export interface TableContextType<T> extends BaseProps<T> {
  table: Table<T>;
}

// 🔹 Children props for table provider
type ChildrenProps<T> = {
  table: Table<T>;
  selectedRows: T[] | undefined;
};

// 🔹 Table provider props
interface TableProviderProps<T>
  extends Pick<BaseProps<T>, "onDoubleClickHandler" | "onSingleClickHandler"> {
  children: (props: ChildrenProps<T>) => React.ReactNode;
  columns: ColumnDef<T, any>[];
  data: T[];
}

// 🔹 Main Table Provider component
const TableProvider = <T,>({
  data,
  columns,
  children,
  onDoubleClickHandler,
  onSingleClickHandler,
}: TableProviderProps<T>): ReactNode => {
  const flatData = useMemo(() => data ?? [], [data]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: flatData,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      minSize: 60,
      maxSize: 1200,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: (value: string) => setGlobalFilter(value),
  });

  // 🔹 Update selected rows on table filter/selection change
  useEffect(() => {
    const selected = table.getFilteredSelectedRowModel().rows;
    setSelectedRows(selected.map((val: any) => val.original));
  }, [rowSelection, table]);

  // 🔹 Reset selection when Escape key is pressed
  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        table.resetRowSelection();
      }
    };
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [table]);

  return (
    <TableContext.Provider
      value={{
        onDoubleClickHandler,
        onSingleClickHandler,
        setGlobalFilter,
        globalFilter,
        table,
      }}
    >
      <>{children({ table, selectedRows })}</>
    </TableContext.Provider>
  );
};

export { TableProvider, useGlobalTable };
