import faker from 'faker';

export function shortId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function randomColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

interface RowData {
    ID: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    music: string;
}

interface ColumnOption {
    label: string;
    backgroundColor: string;
}

interface Column {
    id: string | number;
    label: string;
    accessor: string;
    minWidth?: number;
    width?: number;
    dataType: string;
    options: ColumnOption[];
    disableResizing?: boolean;
}

export function makeData(count: number): { columns: Column[], data: RowData[], skipReset: boolean } {
    let data: RowData[] = [];
    let options: ColumnOption[] = [];
    for (let i = 0; i < count; i++) {
        let row: RowData = {
            ID: faker.mersenne.rand(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            age: Math.floor(20 + Math.random() * 20),
            music: faker.music.genre(),
        };
        options.push({ label: row.music, backgroundColor: randomColor() });

        data.push(row);
    }

    options = options.filter(
        (a, i, self) => self.findIndex(b => b.label === a.label) === i
    );

    let columns: Column[] = [
        {
            id: 'firstName',
            label: 'First Name',
            accessor: 'firstName',
            minWidth: 100,
            dataType: DataTypes.TEXT,
            options: [],
        },
        {
            id: 'lastName',
            label: 'Last Name',
            accessor: 'lastName',
            minWidth: 100,
            dataType: DataTypes.TEXT,
            options: [],
        },
        {
            id: 'age',
            label: 'Age',
            accessor: 'age',
            width: 80,
            dataType: DataTypes.NUMBER,
            options: [],
        },
        {
            id: 'email',
            label: 'E-Mail',
            accessor: 'email',
            width: 300,
            dataType: DataTypes.TEXT,
            options: [],
        },
        {
            id: 'music',
            label: 'Music Preference',
            accessor: 'music',
            dataType: DataTypes.SELECT,
            width: 200,
            options: options,
        },
        {
            id: Constants.ADD_COLUMN_ID,
            width: 20,
            accessor:"",
            label: '+',
            disableResizing: true,
            dataType: 'null',
            options: [],
        },
    ];
    return { columns: columns, data: data, skipReset: false };
}

export const ActionTypes = Object.freeze({
    ADD_OPTION_TO_COLUMN: 'add_option_to_column',
    ADD_ROW: 'add_row',
    UPDATE_COLUMN_TYPE: 'update_column_type',
    UPDATE_COLUMN_HEADER: 'update_column_header',
    UPDATE_CELL: 'update_cell',
    ADD_COLUMN_TO_LEFT: 'add_column_to_left',
    ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
    DELETE_COLUMN: 'delete_column',
    ENABLE_RESET: 'enable_reset',
});

export const DataTypes = Object.freeze({
    NUMBER: 'number',
    TEXT: 'text',
    SELECT: 'select',
});

export const Constants = Object.freeze({
    ADD_COLUMN_ID: 999999,
});
