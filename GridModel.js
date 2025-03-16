import { CellModel } from "./CellModel.js";
import { EventPublisher } from "./EventPublisher.js";

const ROW_COUNT = 20;
const COL_COUNT = 20;
const MINE_RATIO = 0.2;
const INIT_OPEN_ROWS = 5;

export class GridModel extends EventPublisher {
    constructor() {
        super();
        /**
         * @type {Array<Array<CellModel>>}
         */
        this._grid = [];
        this._currentCellId = 0;
    }

    get grid() {
        return this._grid;
    }

    init() {
        this._grid = [];
        this._currentCellId = 0;

        for (let i = 0; i < ROW_COUNT; i++) {
            this._pushNewRow();
        }

        this._calcNeighborMineCount();

        this.fire('gridChange', this._grid);

        const zeroCells = this._grid.slice(0, INIT_OPEN_ROWS).flat()
            .filter((cell) => cell.neighborMineCount === 0);
        const randIdx = Math.floor(Math.random() * zeroCells.length);
        const initOpenCell = zeroCells[randIdx];
        this.openCell(initOpenCell.id);
    }

    openCell(cellId) {
        const { rowIdx, colIdx } = this._getCellIdxById(cellId);
        this._openCellByIdx(rowIdx, colIdx);
    }

    flagCell(cellId) {

        const { rowIdx, colIdx } = this._getCellIdxById(cellId);
        const cell = this._getCellByIdx(rowIdx, colIdx);
        const oldCell = structuredClone(cell);
        if (!cell) {
            return;
        }
        if (cell.isOpened) {
            return;
        }

        cell.flag = !cell.flag;
        this.fire('cellChange', cell, oldCell);
    }

    shiftGird() {
        let shiftRowCount = 0;
        while (
            this._grid[0].every((cell) => cell.isMine || cell.isOpened) &&
            this._grid[1].every((cell) => cell.isMine || cell.isOpened)
        ) {
            this._grid.shift();
            this._pushNewRow();
            shiftRowCount++;
        }

        if (shiftRowCount > 0) {
            this._calcNeighborMineCount();
            this.fire('gridChange', this._grid);
        }

        return shiftRowCount;
    }

    getData() {
        return {
            grid: this._grid.map((row) => {
                return row.map((cellModel) => cellModel.getData());
            }),
            currentCellId: this._currentCellId,
        };
    }

    setData(data) {
        this._grid = data?.grid?.map((row) => {
            return row.map((cellData) => {
                const cellModel = new CellModel();
                cellModel.setData(cellData);
                return cellModel;
            });
        }) ?? [];
        this._currentCellId = data?.currentCellId ?? 0;

        this.fire('gridChange', this._grid);
    }

    _calcNeighborMineCount() {
        this._grid.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                cell.neighborMineCount = this._getNeighborMineCount(rowIdx, colIdx);
            });
        });
    }

    _pushNewRow() {
        const row = [];
        this._grid.push(row);
        for (let j = 0; j < COL_COUNT; j++) {
            const isMine = (Math.random() < MINE_RATIO);
            const cell = new CellModel(`cell_${this._currentCellId++}`, isMine);
            row.push(cell);
        }
    }

    _openCellByIdx(rowIdx, colIdx) {
        const cell = this._getCellByIdx(rowIdx, colIdx);
        const oldCell = structuredClone(cell);
        if (!cell) {
            return;
        }
        if (cell.isOpened) {
            return;
        }
        if (cell.flag) {
            return;
        }

        cell.isOpened = true;
        this.fire('cellChange', cell, oldCell);

        if (!cell.isMine && cell.neighborMineCount === 0) {
            this._openCellByIdx(rowIdx - 1, colIdx - 1);
            this._openCellByIdx(rowIdx - 1, colIdx);
            this._openCellByIdx(rowIdx - 1, colIdx + 1);
            this._openCellByIdx(rowIdx, colIdx - 1);
            this._openCellByIdx(rowIdx, colIdx + 1);
            this._openCellByIdx(rowIdx + 1, colIdx - 1);
            this._openCellByIdx(rowIdx + 1, colIdx);
            this._openCellByIdx(rowIdx + 1, colIdx + 1);
        }
    }

    /**
     * 
     * @param {string} cellId 
     * @returns {{rowIdx: number, colIdx: number}}
     */
    _getCellIdxById(cellId) {
        for (let rowIdx = 0; rowIdx < this._grid.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this._grid[rowIdx].length; colIdx++) {
                if (this._grid[rowIdx][colIdx].id === cellId) {
                    return { rowIdx, colIdx };
                }
            }
        }
    }

    _getNeighborMineCount(rowIdx, colIdx) {
        let cnt = 0;
        cnt += (this._getCellByIdx(rowIdx - 1, colIdx - 1)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx - 1, colIdx)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx - 1, colIdx + 1)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx, colIdx - 1)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx, colIdx + 1)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx + 1, colIdx - 1)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx + 1, colIdx)?.isMine) ? 1 : 0;
        cnt += (this._getCellByIdx(rowIdx + 1, colIdx + 1)?.isMine) ? 1 : 0;

        return cnt;
    }

    _getCellByIdx(rowIdx, colIdx) {
        if (rowIdx < 0 ||
            rowIdx > this._grid.length - 1 ||
            colIdx < 0 ||
            colIdx > this._grid[rowIdx].length - 1) {
            return null;
        }

        return this._grid[rowIdx][colIdx];
    }
}
