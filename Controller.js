import { GridModel } from './GridModel.js';
import { SaveModel } from './SaveModel.js';
import { SummaryModel } from './SummaryModel.js';
import { View } from './view.js';

export class Controller {
    constructor() {
        this._view = new View();
        this._gridModel = new GridModel();
        this._summaryModel = new SummaryModel();
        this._saveModel = new SaveModel();
    }

    init() {
        this._view.addEventListener('open', this._onOpen.bind(this));
        this._view.addEventListener('flag', this._onFlag.bind(this));
        this._view.addEventListener('reset', this._onReset.bind(this));
        this._view.addEventListener('save', this._onSaveClick.bind(this));
        this._view.addEventListener('load', this._onLoadClick.bind(this));
        this._gridModel.addEventListener('gridChange', this._onGridChange.bind(this));
        this._gridModel.addEventListener('cellChange', this._onCellChange.bind(this));
        this._summaryModel.addEventListener('summaryChange', this._onSummaryChange.bind(this))

        this._gridModel.init();
        this._summaryModel.init();
    }

    _onOpen(cellId) {
        this._gridModel.openCell(cellId);

        const shiftRowCount = this._gridModel.shiftGird();
        this._summaryModel.addClearRowCount(shiftRowCount);
    }

    _onFlag(cellId) {
        this._gridModel.flagCell(cellId);
    }

    _onReset() {
        this._gridModel.init();
        this._summaryModel.init();
    }

    _onSaveClick() {
        this._saveModel.save(
            this._gridModel,
            this._summaryModel,
        );
    }

    _onLoadClick() {
        this._saveModel.load(
            this._gridModel,
            this._summaryModel,
        );
    }

    _onGridChange(grid) {
        this._view.updateGrid(grid);
    }

    _onCellChange(cell, oldCell) {
        this._view.updateCell(cell);

        this._summaryModel.calcSummary(cell, oldCell);
    }

    _onSummaryChange(summary) {
        this._view.updateSummary(summary);
    }

}
