import {
  type Table,
  type FilterFn,
  type Row,
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  useMemo,
  useState,
  type ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};
const TableContext = createContext<TableContextType<any>>({} as any);
const useGlobalTable = <T,>() =>
  useContext(TableContext) as TableContextType<T>;
interface BaseProps<T> {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  onDoubleClickHandler?: (row: Row<T>) => void;
  onSingleClickHandler?: (row: Row<T>) => void;
  globalFilter: string;
}
export interface TableContextType<T> extends BaseProps<T> {
  table: Table<any>;
}
type ChildrenProps<T> = {
  table: Table<T>;
  selectedRows: T[] | undefined;
};
interface TableProviderProps<T>
  extends Pick<BaseProps<T>, "onDoubleClickHandler" | "onSingleClickHandler"> {
  children: (props: ChildrenProps<T>) => React.ReactNode;
  columns: ColumnDef<T, any>[];
  data: T[];
}
const TableProvider: <T>(props: TableProviderProps<T>) => ReactNode = ({
  data,
  columns,
  children,
  onDoubleClickHandler,
  onSingleClickHandler,
}) => {
  const flatData = useMemo(() => data ?? [], [data]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    columns,
    defaultColumn: {
      minSize: 60,
      maxSize: 1200,
    },
    data: flatData,
    state: {
      sorting,
      globalFilter,
      columnFilters,
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
    onGlobalFilterChange: (value) => setGlobalFilter(value),
  });
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length)
      setSelectedRows(selectedRows.map((val) => val.original));
  }, [table.getFilteredSelectedRowModel()]);
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
  }, []);
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
