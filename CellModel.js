export class CellModel {
    constructor(id = 'cell_no_id', isMine = false) {
        this.id = id;
        this.isOpened = false;
        this.isMine = isMine;
        this.flag = false;
        this.neighborMineCount = 0;
    }

    getData() {
        return {
            id: this.id,
            isOpened: this.isOpened,
            isMine: this.isMine,
            flag: this.flag,
            neighborMineCount: this.neighborMineCount,
        };
    }

    setData(data) {
        this.id = data?.id ?? 0;
        this.isOpened = data?.isOpened ?? false;
        this.isMine = data?.isMine ?? false;
        this.flag = data?.flag ?? false;
        this.neighborMineCount = data?.neighborMineCount ?? 0;
    }
}