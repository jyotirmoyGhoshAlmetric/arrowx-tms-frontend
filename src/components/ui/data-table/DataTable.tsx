/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
  type RowData,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import GlobalFilter from "@/components/ui/data-table/GlobalFilter";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Select, { type SingleValue } from "react-select";

// Extend the ColumnMeta interface to include headerClass
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClass?: string;
    cellClass?: string;
  }
}

type GroupedData = {
  groupId: string;
  groupData: any;
  items: any[];
  groupColumns?: string[]; // Columns that should span across all items in group
};

type ServerSideConfig = {
  enabled: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (value: string) => void;
  pageCount?: number;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  sorting?: SortingState;
  globalFilter?: string;
};

type DataTableProps = {
  title?: string;
  subTitle?: string;
  data: any[] | GroupedData[];
  showAddButton?: boolean;
  addButtonText?: string;
  addButtonAction?: () => void;
  showFilterButton?: boolean;
  filterButtonValue?: SingleValue<{ label: string; value: string }>;
  filterButtonAction?: (
    value: SingleValue<{ label: string; value: string }>,
  ) => void;
  showCompanyFilter?: boolean;
  companyFilterValue?: SingleValue<{ label: string; value: string }>;
  companyFilterAction?: (
    value: SingleValue<{ label: string; value: string }>,
  ) => void;
  companyFilterOptions?: { label: string; value: string }[];
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  showPagination?: boolean;
  showSearch?: boolean;
  showHeader?: boolean;
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  showBulkActions?: boolean;
  bulkActions?: Array<{
    label: string;
    icon?: string;
    action: (selectedRows: any[]) => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  // New props for grouped data
  isGrouped?: boolean;
  groupColumns?: string[]; // Column accessorKeys that should have row spans
  // Fixed column props
  enableFixedFirstColumn?: boolean;
  fixedColumnWidth?: string;
  // Server-side configuration
  serverSide?: ServerSideConfig;
  // Search debouncing
  searchDebounceMs?: number;
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  title,
  subTitle,
  showAddButton = false,
  addButtonText = "Add",
  addButtonAction,
  showFilterButton = false,
  filterButtonValue = null,
  filterButtonAction,
  showCompanyFilter = false,
  companyFilterValue = null,
  companyFilterAction,
  companyFilterOptions = [],
  isLoading = false,
  onRowClick,
  showPagination = true,
  showSearch = true,
  showHeader = true,
  enableRowSelection = false,
  onSelectionChange,
  showBulkActions = false,
  bulkActions = [],
  isGrouped = false,
  groupColumns = [],
  enableFixedFirstColumn = true,
  fixedColumnWidth = "200px",
  serverSide = { enabled: false },
  searchDebounceMs = 0,
}) => {
  const isServerSide = serverSide.enabled;

  // For server-side mode, use controlled state from props
  // For client-side mode, use internal state
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );

  const [rowSelection, setRowSelection] = useState({});

  // Controlled state values - use server props when in server mode, internal state otherwise
  const globalFilter = isServerSide
    ? serverSide.globalFilter || ""
    : internalGlobalFilter;
  const sorting = isServerSide ? serverSide.sorting || [] : internalSorting;
  const pagination = isServerSide
    ? {
        pageIndex: (serverSide.currentPage || 1) - 1,
        pageSize: serverSide.pageSize || 10,
      }
    : internalPagination;

  // Custom pagination state for grouped data
  const [groupPaginationState, setGroupPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handler functions that call parent handlers for server-side or update internal state for client-side
  const handleGlobalFilterChange = (value: string) => {
    if (isServerSide && serverSide.onGlobalFilterChange) {
      serverSide.onGlobalFilterChange(value);
    } else {
      setInternalGlobalFilter(value);
    }
  };

  const handleSortingChange = (updater: any) => {
    if (isServerSide && serverSide.onSortingChange) {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      serverSide.onSortingChange(newSorting);
    } else {
      setInternalSorting(updater);
    }
  };

  const handlePaginationChange = (updater: any) => {
    if (isServerSide && serverSide.onPaginationChange) {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      serverSide.onPaginationChange(newPagination);
    } else {
      setInternalPagination(updater);
    }
  };

  // Custom pagination functions for grouped data
  const goToPage = (pageIndex: number) => {
    if (isGrouped && showPagination) {
      setGroupPaginationState((prev) => ({ ...prev, pageIndex }));
    } else if (isServerSide && serverSide.onPaginationChange) {
      serverSide.onPaginationChange({ ...pagination, pageIndex });
    } else {
      setInternalPagination((prev) => ({ ...prev, pageIndex }));
    }
  };

  const nextPage = () => {
    if (isGrouped && showPagination) {
      setGroupPaginationState((prev) => ({
        ...prev,
        pageIndex: Math.min(
          prev.pageIndex + 1,
          Math.ceil((groupedData?.length || 0) / prev.pageSize) - 1,
        ),
      }));
    } else if (isServerSide) {
      const maxPageIndex = serverSide.pageCount
        ? serverSide.pageCount - 1
        : pagination.pageIndex + 1;
      const newPageIndex = Math.min(pagination.pageIndex + 1, maxPageIndex);
      if (serverSide.onPaginationChange) {
        serverSide.onPaginationChange({
          ...pagination,
          pageIndex: newPageIndex,
        });
      }
    } else {
      setInternalPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    }
  };

  const previousPage = () => {
    if (isGrouped && showPagination) {
      setGroupPaginationState((prev) => ({
        ...prev,
        pageIndex: Math.max(prev.pageIndex - 1, 0),
      }));
    } else if (isServerSide) {
      const newPageIndex = Math.max(pagination.pageIndex - 1, 0);
      if (serverSide.onPaginationChange) {
        serverSide.onPaginationChange({
          ...pagination,
          pageIndex: newPageIndex,
        });
      }
    } else {
      setInternalPagination((prev) => ({
        ...prev,
        pageIndex: Math.max(prev.pageIndex - 1, 0),
      }));
    }
  };

  const setCustomPageSize = (size: number) => {
    if (isGrouped && showPagination) {
      setGroupPaginationState({ pageIndex: 0, pageSize: size });
    } else if (isServerSide && serverSide.onPaginationChange) {
      serverSide.onPaginationChange({ pageIndex: 0, pageSize: size });
    } else {
      setInternalPagination({ pageIndex: 0, pageSize: size });
    }
  };

  // Process grouped data for pagination
  const groupedData = useMemo(() => {
    if (!isGrouped) {
      return null;
    }

    // If data is already in GroupedData format, use it directly
    if (Array.isArray(data) && data.length > 0 && "groupId" in data[0]) {
      return data as GroupedData[];
    }

    // Convert DTC codes format to grouped format
    return (data as any[]).map((group) => ({
      groupId: group.id || group.groupId || `group-${Math.random()}`,
      groupData: {
        vehicleNumber: group.vehicleNumber,
        vehicleType: group.vehicleType,
        vinNumber: group.vinNumber,
      },
      items: group.dtcCode || group.items || [group],
    }));
  }, [data, isGrouped]);

  // Process data for display based on pagination
  const processedData = useMemo(() => {
    if (!isGrouped) {
      return data as any[];
    }

    if (!groupedData) {
      return [];
    }

    // If pagination is enabled, paginate by groups
    let dataToProcess = groupedData;
    if (showPagination) {
      const pageSize = groupPaginationState.pageSize;
      const pageIndex = groupPaginationState.pageIndex;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      dataToProcess = groupedData.slice(startIndex, endIndex);
    }

    // Flatten the paginated groups into rows
    return dataToProcess.flatMap((group) =>
      group.items.map((item: any, index: number) => ({
        ...item,
        ...group.groupData,
        _groupId: group.groupId,
        _groupIndex: index,
        _groupSize: group.items.length,
        _isGroupStart: index === 0,
      })),
    );
  }, [data, groupedData, isGrouped, showPagination, groupPaginationState]);

  // Create checkbox column for row selection
  const checkboxColumn = useMemo(
    () => ({
      id: "select",
      header: ({ table }: any) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    }),
    [],
  );

  // Combine checkbox column with user columns if selection is enabled
  const finalColumns = useMemo(() => {
    if (enableRowSelection) {
      return [checkboxColumn, ...columns];
    }
    return columns;
  }, [enableRowSelection, checkboxColumn, columns]);

  // Calculate total pages based on groups for grouped data
  const totalPages = useMemo(() => {
    if (!isGrouped || !showPagination || !groupedData) {
      return 1;
    }
    return Math.ceil(groupedData.length / groupPaginationState.pageSize);
  }, [isGrouped, showPagination, groupedData, groupPaginationState.pageSize]);

  const table = useReactTable({
    data: processedData,
    columns: finalColumns,
    state: {
      globalFilter,
      rowSelection,
      sorting,
      pagination:
        isGrouped && showPagination ? groupPaginationState : pagination,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: handleGlobalFilterChange,
    onSortingChange: handleSortingChange,
    onPaginationChange: isGrouped ? undefined : handlePaginationChange,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    getPaginationRowModel:
      isServerSide || isGrouped ? undefined : getPaginationRowModel(),
    manualPagination: isServerSide || (isGrouped && showPagination),
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    pageCount: isServerSide
      ? serverSide.pageCount
      : isGrouped && showPagination
        ? totalPages
        : undefined,
    initialState: {
      pagination: {
        pageSize: showPagination
          ? isGrouped
            ? groupPaginationState.pageSize
            : pagination.pageSize
          : processedData?.length || 1000,
      },
    },
  });

  // Get selected rows data and notify parent component
  const selectedRowsData = useMemo(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table.getSelectedRowModel().rows]);

  const selectedCount = Object.keys(rowSelection).length;

  // Use ref to store previous selection to avoid infinite loops
  const prevSelectionRef = useRef<string>("");

  // Notify parent component when selection changes
  useEffect(() => {
    const currentSelection = JSON.stringify(rowSelection);
    if (onSelectionChange && currentSelection !== prevSelectionRef.current) {
      prevSelectionRef.current = currentSelection;
      onSelectionChange(selectedRowsData);
    }
  }, [rowSelection, selectedRowsData, onSelectionChange]);

  // Clear selection function
  const clearSelection = () => {
    setRowSelection({});
  };

  // Helper function to check if a column should be rendered with row span
  const shouldRenderCell = (column: any, row: any) => {
    if (!isGrouped) return true;

    const accessorKey = (column.columnDef as any).accessorKey;
    if (accessorKey && groupColumns.includes(accessorKey)) {
      return row.original._isGroupStart;
    }
    return true;
  };

  // Helper function to get row span for grouped columns
  const getRowSpan = (column: any, row: any) => {
    if (!isGrouped) return 1;

    const accessorKey = (column.columnDef as any).accessorKey;
    if (
      accessorKey &&
      groupColumns.includes(accessorKey) &&
      row.original._isGroupStart
    ) {
      return row.original._groupSize;
    }
    return 1;
  };

  const AddDriverButton = useMemo(
    () => (
      <Button
        type="button"
        text={addButtonText}
        icon="heroicons:plus-circle"
        className="btn btn-dark block w-36 text-center"
        onClick={addButtonAction}
      />
    ),
    [addButtonText, addButtonAction],
  );

  const ShowFilterButton = useMemo(
    () => (
      <Select
        className="react-select w-[250px]"
        classNamePrefix="select"
        value={filterButtonValue}
        options={[
          {
            label: "All",
            value: "",
          },
          {
            label: "Active",
            value: "active",
          },
          {
            label: "Inactive",
            value: "inactive",
          },
        ]}
        styles={{
          container: (base) => ({
            ...base,
            width: "150px",
          }),
          control: (base) => ({
            ...base,
            height: "42px",
          }),
        }}
        onChange={(value) =>
          filterButtonAction?.(
            value as SingleValue<{ label: string; value: string }>,
          )
        }
      />
    ),
    [filterButtonValue, filterButtonAction],
  );

  const ShowCompanyFilterButton = useMemo(
    () => (
      <Select
        className="react-select w-[250px]"
        classNamePrefix="select"
        value={companyFilterValue}
        options={companyFilterOptions}
        placeholder="Filter by Company"
        styles={{
          container: (base) => ({
            ...base,
            width: "200px",
          }),
          control: (base) => ({
            ...base,
            height: "42px",
          }),
        }}
        onChange={(value) =>
          companyFilterAction?.(
            value as SingleValue<{ label: string; value: string }>,
          )
        }
      />
    ),
    [companyFilterValue, companyFilterAction, companyFilterOptions],
  );

  // Get pagination state based on whether we're using grouped pagination or server-side
  const pageIndex =
    isGrouped && showPagination
      ? groupPaginationState.pageIndex
      : isServerSide
        ? pagination.pageIndex
        : (table?.getState?.()?.pagination?.pageIndex ?? 0);
  const pageSize =
    isGrouped && showPagination
      ? groupPaginationState.pageSize
      : isServerSide
        ? pagination.pageSize
        : (table?.getState?.()?.pagination?.pageSize ?? 10);
  const totalPagesCount =
    isGrouped && showPagination
      ? totalPages
      : isServerSide
        ? (serverSide.pageCount ?? 1)
        : (table?.getPageCount?.() ?? 1);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPagesCount - 1;

  // Calculate total count based on mode
  const totalCount = isServerSide
    ? (serverSide.totalCount ?? 0)
    : isGrouped
      ? (groupedData?.length ?? 0)
      : table.getPreFilteredRowModel().rows.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
    >
      {/* Header Section */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border-b border-slate-200 dark:border-slate-700 px-4 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                {title && (
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                )}

                {subTitle && (
                  <h3 className="text-sm font-normal text-slate-900 dark:text-white">
                    {subTitle}
                  </h3>
                )}
              </div>

              {/* Selection Info */}
              {enableRowSelection && selectedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg"
                >
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {selectedCount} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                    title="Clear selection"
                  >
                    <Icon icon="heroicons:x-mark" className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Bulk Actions */}
              {enableRowSelection &&
                selectedCount > 0 &&
                showBulkActions &&
                bulkActions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2"
                  >
                    {bulkActions.map((action, index) => (
                      <Button
                        key={index}
                        type="button"
                        text={action.label}
                        icon={action.icon}
                        className="btn-outline-dark"
                        onClick={() => action.action(selectedRowsData)}
                      />
                    ))}
                  </motion.div>
                )}

              {showSearch && (
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={handleGlobalFilterChange}
                  debounceMs={searchDebounceMs}
                />
              )}
              {showCompanyFilter && ShowCompanyFilterButton}
              {showFilterButton && ShowFilterButton}
              {showAddButton && AddDriverButton}
            </div>
          </div>
        </motion.div>
      )}

      {/* Table Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`${enableFixedFirstColumn ? "fixed-first-column-container" : "overflow-x-auto"}`}
      >
        <table
          className={`w-full ${enableFixedFirstColumn ? "fixed-first-column-table" : ""}`}
        >
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-200 dark:border-slate-700"
              >
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      enableFixedFirstColumn && index === 0
                        ? "fixed-first-column-header sticky left-0 z-20 bg-slate-50 dark:bg-slate-800"
                        : ""
                    }`}
                    style={
                      enableFixedFirstColumn && index === 0
                        ? {
                            width: fixedColumnWidth,
                            minWidth: fixedColumnWidth,
                          }
                        : {}
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: (
                              <Icon
                                icon="heroicons:chevron-up"
                                className="w-4 h-4"
                              />
                            ),
                            desc: (
                              <Icon
                                icon="heroicons:chevron-down"
                                className="w-4 h-4"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <Icon
                              icon="heroicons:chevron-up-down"
                              className="w-4 h-4 opacity-30"
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td
                  colSpan={finalColumns.length}
                  className="px-4 py-12 text-center"
                >
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
                    <motion.span
                      className="ml-3 text-slate-500 dark:text-slate-400"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      Loading...
                    </motion.span>
                  </motion.div>
                </td>
              </motion.tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <td
                  colSpan={finalColumns.length}
                  className="px-4 py-12 text-center"
                >
                  <motion.div
                    className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                    >
                      <Icon
                        icon="heroicons:inbox"
                        className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600"
                      />
                    </motion.div>
                    <motion.p
                      className="text-sm font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      No data available
                    </motion.p>
                    <motion.p
                      className="text-xs mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      There are no records to display at this time.
                    </motion.p>
                  </motion.div>
                </td>
              </motion.tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={
                      enableFixedFirstColumn
                        ? { opacity: 0 }
                        : { opacity: 0, x: -20, scale: 0.95 }
                    }
                    animate={
                      enableFixedFirstColumn
                        ? {
                            opacity: 1,
                            transition: {
                              duration: 0.3,
                              delay: index * 0.05,
                              ease: "easeOut",
                            },
                          }
                        : {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              duration: 0.3,
                              delay: index * 0.05, // Stagger animation
                              ease: "easeOut",
                            },
                          }
                    }
                    exit={
                      enableFixedFirstColumn
                        ? {
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }
                        : {
                            opacity: 0,
                            x: 20,
                            scale: 0.95,
                            transition: { duration: 0.2 },
                          }
                    }
                    whileHover={
                      !isGrouped && !enableFixedFirstColumn
                        ? {
                            scale: 1.01,
                            transition: { duration: 0.2 },
                          }
                        : undefined
                    }
                    layout={!enableFixedFirstColumn}
                    onClick={() => onRowClick?.(row.original)}
                    className={`
                      ${onRowClick ? "cursor-pointer" : ""}
                      ${row.getIsSelected() ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                      ${
                        isGrouped
                          ? "hover:bg-slate-25 dark:hover:bg-slate-700/20 transition-colors duration-150"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                      }
                      ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/50"}
                    `}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const shouldRender = shouldRenderCell(cell.column, row);
                      const rowSpan = getRowSpan(cell.column, row);
                      const accessorKey = (cell.column.columnDef as any)
                        .accessorKey;
                      const isGroupColumn =
                        isGrouped &&
                        accessorKey &&
                        groupColumns.includes(accessorKey);

                      if (!shouldRender) return null;

                      // Render fixed first column without animation
                      if (enableFixedFirstColumn && cellIndex === 0) {
                        return (
                          <td
                            key={cell.id}
                            rowSpan={rowSpan}
                            className={`px-4 py-4 text-sm text-slate-900 dark:text-slate-100 ${
                              isGroupColumn
                                ? "border-r border-slate-200 dark:border-slate-700 bg-slate-25 dark:bg-slate-800/50"
                                : ""
                            } ${
                              cell.column.columnDef.id === "description"
                                ? ""
                                : "whitespace-nowrap"
                            } fixed-first-column-cell sticky left-0 z-10 bg-white dark:bg-slate-800`}
                            style={{
                              width: fixedColumnWidth,
                              minWidth: fixedColumnWidth,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      }

                      // Render other columns with animation
                      return (
                        <motion.td
                          key={cell.id}
                          rowSpan={rowSpan}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05 + cellIndex * 0.02,
                            ease: "easeOut",
                          }}
                          className={`px-4 py-4 text-sm text-slate-900 dark:text-slate-100 ${
                            isGroupColumn
                              ? "border-r border-slate-200 dark:border-slate-700 bg-slate-25 dark:bg-slate-800/50"
                              : ""
                          } ${
                            cell.column.columnDef.id === "description"
                              ? ""
                              : "whitespace-nowrap"
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </motion.td>
                      );
                    })}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination Footer */}
      {showPagination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border-t border-slate-200 dark:border-slate-700 px-4 py-4"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Row selection info and page size */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {isGrouped ? "Groups per page" : "Rows per page"}
                </span>
                <select
                  className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    if (isGrouped && showPagination) {
                      setCustomPageSize(newSize);
                    } else if (isServerSide) {
                      setCustomPageSize(newSize);
                    } else {
                      table?.setPageSize?.(newSize);
                    }
                  }}
                >
                  {[10, 25, 50].map((pageSizeOption) => (
                    <option key={pageSizeOption} value={pageSizeOption}>
                      {pageSizeOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                Page {pageIndex + 1} of {totalPagesCount} (Total: {totalCount})
              </div>
            </div>

            {/* Right side - Pagination controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  if (isGrouped && showPagination) {
                    goToPage(0);
                  } else if (isServerSide) {
                    goToPage(0);
                  } else {
                    table?.setPageIndex?.(0);
                  }
                }}
                disabled={!canPreviousPage}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <Icon
                  icon="heroicons:chevron-double-left"
                  className="w-4 h-4 text-slate-600 dark:text-slate-400"
                />
              </button>

              <button
                onClick={() => {
                  if (isGrouped && showPagination) {
                    previousPage();
                  } else if (isServerSide) {
                    previousPage();
                  } else {
                    table?.previousPage?.();
                  }
                }}
                disabled={!canPreviousPage}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <Icon
                  icon="heroicons:chevron-left"
                  className="w-4 h-4 text-slate-600 dark:text-slate-400"
                />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1 mx-2">
                {Array.from(
                  { length: Math.min(totalPagesCount, 7) },
                  (_, i) => {
                    const totalPages = totalPagesCount;
                    const currentPage = pageIndex;

                    // Calculate which pages to show (max 7 pages with ellipsis logic)
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i;
                    } else if (currentPage < 4) {
                      pageNumber = i;
                    } else if (currentPage >= totalPages - 4) {
                      pageNumber = totalPages - 7 + i;
                    } else {
                      pageNumber = currentPage - 3 + i;
                    }

                    if (pageNumber < 0 || pageNumber >= totalPages) return null;

                    const isCurrentPage = pageNumber === currentPage;

                    return (
                      <motion.button
                        key={pageNumber}
                        onClick={() => {
                          if (isGrouped && showPagination) {
                            goToPage(pageNumber);
                          } else if (isServerSide) {
                            goToPage(pageNumber);
                          } else {
                            table?.setPageIndex?.(pageNumber);
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
                          min-w-[32px] h-8 px-2 text-sm font-medium rounded-md transition-colors
                            ${
                              isCurrentPage
                                ? "bg-slate-900 text-white dark:bg-slate-600 dark:text-slate-100"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }
                          `}
                      >
                        {pageNumber + 1}
                      </motion.button>
                    );
                  },
                )}
              </div>

              <button
                onClick={() => {
                  if (isGrouped && showPagination) {
                    nextPage();
                  } else if (isServerSide) {
                    nextPage();
                  } else {
                    table?.nextPage?.();
                  }
                }}
                disabled={!canNextPage}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <Icon
                  icon="heroicons:chevron-right"
                  className="w-4 h-4 text-slate-600 dark:text-slate-400"
                />
              </button>

              <button
                onClick={() => {
                  if (isGrouped && showPagination) {
                    goToPage(totalPagesCount - 1);
                  } else if (isServerSide) {
                    goToPage(totalPagesCount - 1);
                  } else {
                    const lastPageIndex = (table?.getPageCount?.() ?? 1) - 1;
                    table?.setPageIndex?.(lastPageIndex);
                  }
                }}
                disabled={!canNextPage}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <Icon
                  icon="heroicons:chevron-double-right"
                  className="w-4 h-4 text-slate-600 dark:text-slate-400"
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataTable;
