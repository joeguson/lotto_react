function getNewLottoCombination() {
    const combinationSet = new Set();
    while (combinationSet.size < 6) {
        const num = Math.floor(Math.random() * 46);
        if (num === 0) continue;
        combinationSet.add(num);
    }
    return new Array(...combinationSet).sort((a, b) => (a - b));
}

function getNewLottoCombinationById() {
    const num = Math.floor(Math.random() * 8145061);
    if (num === 0) return getNewLottoCombinationById();
    return num;
}

function compareCombination(comb1, comb2) {
    return JSON.stringify(comb1) === JSON.stringify(comb2);
}

function getConsequtives(combinationsArr) {
    const consequtives = new Array(5).fill(0);
    // 0 - 2ea (3times), 1 - 3ea (2times), 2 - 4ea, 3 - 5ea, 4 - 6ea
    // consequtives[0] = [[], [], []];
    // consequtives[1] = [[], []];
    // consequtives[2] = 0;
    // consequtives[3] = 0;
    // consequtives[4] = 0;

    for (let i = 0; i < combinationsArr.length; i++) {
        const combination = combinationsArr[i];
        if (combination[5] - combination[0] === 5) {
            consequtives[4] += 1;
            continue;
        }
        if (combination[5] - combination[1] === 4 || combination[4]  - combination[0] === 4) {
            consequtives[3] += 1;
            continue;
        }
        if (combination[3] - combination[0] === 3 || combination[4]  - combination[1] === 3 || combination[5] - combination[2] === 3) {
            consequtives[2] += 1;
            continue;
        }
        if (combination[2] - combination[0] === 2 || combination[3]  - combination[1] === 2 || combination[4] - combination[2] === 2 || combination[5] - combination[3] === 2) {
            consequtives[1] += 1;
            continue;
        }
        if (combination[1] - combination[0] === 1 || combination[2]  - combination[1] === 1 || combination[3] - combination[2] === 1 || combination[4] - combination[3] === 1 || combination[5] - combination[4] === 1) {
            consequtives[0] += 1;
        }
    }
    return consequtives;
}