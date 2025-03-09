import { GridModel } from "./GridModel.js";
import { SummaryModel } from "./SummaryModel.js";

export class SaveModel {
    /**
     * @param {GridModel} gridModel 
     * @param {SummaryModel} summaryModel 
     */
    save(gridModel, summaryModel) {
        const saveData = {
            saveDate: Date.now(),
            summary: summaryModel.getData(),
            grid: gridModel.getData(),
        };
        console.log(saveData);
        const saveDataJson = JSON.stringify(saveData);

        localStorage.setItem('saveData', saveDataJson);
    }

    load(gridModel, summaryModel) {
        const saveDataJson = localStorage.getItem('saveData');
        if (!saveDataJson) {
            return;
        }
        const saveData = JSON.parse(saveDataJson);

        summaryModel.setData(saveData.summary);
        gridModel.setData(saveData.grid);
    }
}