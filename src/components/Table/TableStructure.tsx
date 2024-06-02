"use client"

import React, { useMemo, useState } from "react";
import BodyTable from "./BodyTable";
import ToolTable from "./ToolTable";
import PaginateTable from "./PaginateTable";
import paginate from "./utils/paginate";
import sortPath from "./utils/sortPath";
import styles from "./Table.module.scss";

export interface TableStructure {
    id: string
    title: string
    searchPath: string,
    defaultSort?: string,
    structure: Column[]
}

export interface Column {
    label: string;
    width: string;
    height?: string;
    fontSize?: string;
    path?: string;
    element?: (val: any) => React.ReactElement;
}

export interface sortColumnProps {
    path: string;
    order: boolean;
}

interface thisProps {
    data: Array<any>;
    isEditable: boolean;
    structure: TableStructure;
    handleUpdate: Function;
    handleDelete: Function;
    handleAdd?: Function;
    handleRefresh?: Function;
}

export default function MainTable({
    data,
    isEditable,
    structure,
    handleAdd,
    handleUpdate,
    handleDelete,
}: thisProps) {

    const [page, setPage] = useState({
        current: 0,
        size: 5,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<sortColumnProps>({
        path: structure.defaultSort || structure.searchPath,
        order: true,
    });


    let sortedData = structuredClone(data);


    //sorting by search query filter
    const filteredData = useMemo(
        () => searchQuery ? sortedData.filter((item: any) => item[structure.searchPath].toLowerCase().includes(searchQuery.toLowerCase())) : sortedData,
        [searchQuery, structure.searchPath, sortedData]
    );

    //get total data filtered by search
    const sizeData = sortedData.length;

    //sorting by path
    const sortedFilteredData = useMemo(
        () => sortPath(filteredData, sortColumn.path, sortColumn.order),
        [sortColumn.path, sortColumn.order, filteredData]
    );

    //pagination data
    const paginatedData = useMemo(
        () => paginate(sortedFilteredData, page.current, page.size),
        [page.current, page.size, sortedFilteredData]
    );

    return (
        <div className={styles.container_table}>
            <ToolTable
                searchValue={searchQuery}
                changeText={onChangeSearchQuery}
                title={structure.title}
                isHaveAdd={Boolean(handleAdd)}
                handleAdd={handleAdd || (() => { })}
            />
            {paginatedData.length > 0 ? (
                <BodyTable
                    isEditable={isEditable}
                    data={paginatedData}
                    tableProps={structure}
                    sortColumn={sortColumn}
                    handleSortColumn={onHandleSortColumn}
                    deleteColumn={onDelete}
                    updateColumn={handleUpdate}
                />
            ) : (
                <div>No data available</div>
            )}
            <PaginateTable page={page.current} size={page.size} currentTotal={paginatedData.length} total={sizeData} handlePagination={onHandlePagination} />
        </div>
    );

    function onDelete(data: any) {
        handleDelete(data);
        // setPage(page => ({
        //     ...page,
        //     current: 0,
        // }));
    }

    function onHandlePagination(inputValue: number) {
        const currentValue = inputValue * page.size;

        if (currentValue >= sizeData || currentValue < 0) return;

        setPage(page => ({ ...page, current: inputValue }));
    }

    function onChangeSearchQuery(inputValue: string) {
        setSearchQuery(inputValue);
        setPage(page => ({
            ...page,
            current: 0,
        }));
    }

    function onHandleSortColumn(path: string, order = true) {
        const temp = { order, path };
        if (temp.path == sortColumn.path)
            temp.order = temp.order ? false : true;

        setSortColumn({ order: temp.order, path: temp.path });
    }

}