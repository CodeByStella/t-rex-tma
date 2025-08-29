import { TREE_STATUS, TREE_TYPE, SMALL_TREE_WIDTH, BIG_TREE_WIDTH } from '@/global/enums';

export const rectBuilder = (treeType: TREE_TYPE, isSmallTree: TREE_STATUS) => {
    const rect = {
        rectX: 650,
        rectY: 0,
        rectW: BIG_TREE_WIDTH.WIDTH_50 as number,
        rectH: 100,
    }

    if (treeType === TREE_TYPE.TYPE_1) {
        rect.rectX = 750;
        rect.rectW = BIG_TREE_WIDTH.WIDTH_50;
    } else if (treeType === TREE_TYPE.TYPE_2) {
        rect.rectX = 847;
        rect.rectW = BIG_TREE_WIDTH.WIDTH_104;
    }

    if (isSmallTree === TREE_STATUS.SMALL) {
        rect.rectX = 440;
        rect.rectW = SMALL_TREE_WIDTH.WIDTH_37;

        if (treeType === TREE_TYPE.TYPE_1) {
            rect.rectX = 511;
            rect.rectW = SMALL_TREE_WIDTH.WIDTH_35;
        } else if (treeType === TREE_TYPE.TYPE_2) {
            rect.rectX = 580;
            rect.rectW = SMALL_TREE_WIDTH.WIDTH_35;
        } else if (treeType === TREE_TYPE.TYPE_3) {
            rect.rectX = 613;
            rect.rectW = SMALL_TREE_WIDTH.WIDTH_37;
        }
    }

    return rect;
}