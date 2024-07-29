export default function expectedPoints(historyElements: any, element: any): number {
    if (historyElements && historyElements.map((el: any) => el.code).includes(element.code)) {
        const elData = historyElements.find((el:any) => el.code == element.code);

        return xpFromxG(elData, element.element_type) + xpFromxA(elData, element.element_type) + xpFromCS(elData, element.element_type) + xpFromSaves(elData, element.element_type) + xpFromBonus(elData, element.element_type) - xpFromxGC(elData, element.element_type);
    }
    return 0;

}

function xpFromxG(elementDataHistory: any, position: number): number {
    switch (position) {
        case 1:
            return elementDataHistory.expected_goals_per_90 * 10
        case 2:
            return elementDataHistory.expected_goals_per_90 * 6
        case 3:
            return elementDataHistory.expected_goals_per_90 * 5
        case 4:
            return elementDataHistory.expected_goals_per_90 * 4
        default:
            return 0;
    }
}

function xpFromxA(elementDataHistory: any, position: number): number {
    return elementDataHistory.expected_assists_per_90 * 3;
}

function xpFromCS(elementDataHistory: any, position: number): number {
    switch (position) {
        case 1:
            return elementDataHistory.clean_sheets_per_90 * 4
        case 2:
            return elementDataHistory.clean_sheets_per_90 * 4
        case 3:
            return elementDataHistory.clean_sheets_per_90 * 1
        case 4:
            return 0
        default:
            return 0;
    }
}

function xpFromSaves(elementDataHistory: any, position: number): number {
    switch (position) {
        case 1:
            return Math.floor(elementDataHistory.saves_per_90 / 3)
        case 2:
            return 0
        case 3:
            return 0
        case 4:
            return 0
        default:
            return 0;
    }
}

function xpFromBonus(elementDataHistory: any, position: number): number {
    switch (position) {
        case 1:
            return 3
        case 2:
            return 3
        case 3:
            return 3
        case 4:
            return 3
        default:
            return 0;
    }
}

function xpFromxGC(elementDataHistory: any, position: number): number {
    switch (position) {
        case 1:
            return Math.floor(elementDataHistory.expected_goals_conceded_per_90 / 2)
        case 2:
            return Math.floor(elementDataHistory.expected_goals_conceded_per_90 / 2)
        case 3:
            return 0
        case 4:
            return 0
        default:
            return 0;
    }
}
