import { CellModel } from './CellModel.js';
import { EventPublisher } from './EventPublisher.js';
import { SummaryModel } from './SummaryModel.js';

export class View extends EventPublisher {
    constructor() {
        super();
        this._gameOver = false;

        document.querySelector('#reset').addEventListener('click', (e) => {
            this.fire('reset');
        });
        document.querySelector('#save').addEventListener('click', (e) => {
            this.fire('save');
        });
        document.querySelector('#load').addEventListener('click', (e) => {
            this.fire('load');
        });
    }

    /**
     * @param {Array<Array<CellModel>>} grid 
     */
    updateGrid(grid) {
        const table = document.querySelector('#main_table');
        while (table.firstChild) {
            table.firstChild.remove();
        }

        grid.forEach(row => {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            row.forEach((cell) => {
                const td = document.createElement('td');
                td.id = `${cell.id}`;
                tr.appendChild(td);

                td.addEventListener('click', (e) => {
                    if (this._gameOver) {
                        return;
                    }
                    this.fire('open', cell.id);
                });
                td.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (this._gameOver) {
                        return;
                    }
                    this.fire('flag', cell.id);
                });

                this.updateCell(cell)
            });
        });
    }

    /**
     * 
     * @param {CellModel} cell 
     * @param {string} id 
     */
    updateCell(cell) {
        const td = document.querySelector(`td#${cell.id}`)
        const cellStatusClass = this._getCellStatusClass(cell);
        td.classList.remove('pin', 'unopened', 'exploded', 'opened');
        td.classList.add(cellStatusClass);
        td.classList.add('cell');
        td.innerText = (cell.isOpened && !cell.isMine) ? cell.neighborMineCount : '';
        // td.innerText = (cell.isMine) ? '*' : cell.neighborMineCount;
    }

    /**
     * @param {SummaryModel} summary 
     */
    updateSummary(summary) {
        document.querySelector('#point').innerText = summary.point;
        document.querySelector('#flagCount').innerText = summary.flagCount;
        document.querySelector('#life').innerText = summary.life;
        document.querySelector('#clearRowCount').innerText = summary.clearRowCount;

        this._setGameOver(summary.gameOver);
    }

    _setGameOver(gameOver) {
        this._gameOver = gameOver;

        if (gameOver) {
            document.querySelector('#game_over').classList.remove('hidden');
            document.querySelectorAll('.cell')
                .forEach((td) => {
                    td.classList.add('disabled');
                });
        } else {
            document.querySelector('#game_over').classList.add('hidden');
            document.querySelectorAll('.cell')
                .forEach((td) => {
                    td.classList.remove('disabled');
                });
        }
    }

    _getCellStatusClass(cellModel) {
        if (cellModel.flag) {
            return 'pin';
        }
        else if (!cellModel.isOpened) {
            return 'unopened';
        }
        else if (cellModel.isMine) {
            return 'exploded';
        } else {
            return 'opened';
        }
    }
}
