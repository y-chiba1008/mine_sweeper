import { CellModel } from "./CellModel.js";
import { EventPublisher } from "./EventPublisher.js";

const INITIAL_LIFE = 3;
const LIFEUP_ROW_COUNT = 10;

export class SummaryModel extends EventPublisher {
    constructor() {
        super();
        this._point = 0;
        this._flagCount = 0;
        this._life = INITIAL_LIFE;
        this._gameOver = false;
        this._clearRowCount = 0;
    }

    get point() {
        return this._point;
    }

    get flagCount() {
        return this._flagCount;
    }

    get life() {
        return this._life;
    }

    get gameOver() {
        return this._gameOver;
    }

    get clearRowCount() {
        return this._clearRowCount;
    }

    init(point = 0, flagCount = 0, life = INITIAL_LIFE,
        gameOver = false, clearRowCount = 0,
    ) {
        this._point = point;
        this._flagCount = flagCount;
        this._life = life;
        this._gameOver = gameOver;
        this._clearRowCount = clearRowCount;
        this.fire('summaryChange', this);
    }

    /**
     * 
     * @param {CellModel} cell 
     * @param {CellModel} oldCell 
     */
    calcSummary(cell, oldCell) {
        if (cell.isOpened && !oldCell.isOpened) {
            if (cell.isMine) {
                this._life -= 1;
            } else {
                this._point += 1;
            }
        }

        if (cell.flag && !oldCell.flag) {
            this._flagCount += 1;
        } else if (!cell.flag && oldCell.flag) {
            this._flagCount -= 1;
        }

        if (this._life === 0) {
            this._gameOver = true;
        }

        this.fire('summaryChange', this);
    }

    addClearRowCount(count) {

        while (count > 0) {
            const requireToLifeUp = LIFEUP_ROW_COUNT - (this._clearRowCount % LIFEUP_ROW_COUNT);

            let currentCount = count;
            if (count >= requireToLifeUp) {
                this._life += 1;
                currentCount = requireToLifeUp;
            }
            this._clearRowCount += currentCount;
            count -= currentCount;
        }

        this.fire('summaryChange', this);
    }

    getData() {
        return {
            point: this._point,
            flagCount: this._flagCount,
            life: this._life,
            gameOver: this._gameOver,
            clearCount: this._clearRowCount,
        };
    }

    setData(data) {
        this._point = data?.point ?? 0;
        this._flagCount = data?.flagCount ?? 0;
        this._life = data?.life ?? INITIAL_LIFE;
        this._gameOver = data?.gameOver ?? false;
        this._clearRowCount = data?.clearCount ?? 0;

        this.fire('summaryChange', this);

    }
}