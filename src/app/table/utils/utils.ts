export const applySorting = (column: string, direction: 'asc' | 'desc', tableData: any[]) => {
    return tableData.sort((a: any, b: any) => {
        if (direction === 'asc') {
            if (a[column] > b[column]) {
                return 1;
            } else if (a[column] < b[column]) {
                return -1;
            } else {
                return 0;
            }
        } else {
            if (a[column] < b[column]) {
                return 1;
            } else if (a[column] > b[column]) {
                return -1;
            } else {
                return 0;
            }
        }
    })
};

export const createMapFromTableData= (tableData: any[]) => {
    const numberOfProperties = Object.keys(tableData[0]).length;
    let mappedData: any[] = [];
    tableData.forEach((row: any, index: number) => {
        const map: { [key: number]: any } = {};
        for (let i = 0; i < numberOfProperties; i++) {
            map[i] = row[Object.keys(row)[i]];
        }
        mappedData.push(map);
    });
    return mappedData;
}
