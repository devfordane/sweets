/**
 * Runs a variant of an unbounded knapsack solution.
 * Will extend its search until an achievable order size is found, then returns it and the number of packs it used as an upper bound.
 * @param orderSize
 * @param packsAvailable
 * @returns {{amountOfPacks: *, target: *}}
 */
const getAchievableOrderSizeAndBestGuessPacks = (orderSize, packsAvailable) => {
    let cells = [0];
    let packCount = [0];

    for (let i = 0; i < packsAvailable[0]; i++) {
        cells.push(0);
        packCount.push(0);
    }

    while (cells[cells.length - 1] < orderSize) {
        let cell = 0;
        let packQty = 0;

        for (let j = 0; j < packsAvailable.length; j++) {
            let thisPlusPrevious = cells[cells.length - packsAvailable[j]] + packsAvailable[j];
            if (thisPlusPrevious > cell) {
                cell = thisPlusPrevious;
                packQty = packCount[cells.length - packsAvailable[j]] + 1;
            }
        }

        packCount.push(packQty);
        cells.push(cell);

    }

    return {
        target: cells[cells.length - 1], amountOfPacks: packCount[packCount.length - 1]
    };
};

/**
 * Recursive function to find the best amount of packs to fulfill a target quantity, subject to pack limits and efficieny limits.
 * @param target
 * @param packsAvailable
 * @param pointer
 * @param cache
 * @param packLimit
 * @param efficientPackLimit
 * @param currentRow
 * @returns {{total, qty, packs}|{total: *, qty: *, packs: *}}
 */
const getBestPacksForQuantity = (target, packsAvailable, pointer, cache, packLimit, efficientPackLimit, currentRow = {}) => {

    const currentPack = packsAvailable[pointer];
    let greatestPossible = getMaxUses(target, currentPack, packLimit, efficientPackLimit[pointer] ?? packLimit);

    if (pointer === packsAvailable.length - 1) { //This is the smallest pack in the collection

        currentRow[pointer] = greatestPossible;
        const result = {
            total: greatestPossible * currentPack, qty: greatestPossible, packs: {
                [pointer]: greatestPossible
            }
        };
        setCache(result, pointer, target, cache, packLimit);
        return {...result};

    } else {

        let [nearestTotal, bestQty] = [0, 0];
        const nextPointer = pointer + 1;
        let bestRow = {};

        //Starting with the qty of this pack that totals nearest the target, find all the combinations of the remaining usable packs
        while (greatestPossible >= 0) {

            currentRow[pointer] = greatestPossible;
            const totalOfThis = greatestPossible * currentPack;
            let siblingTarget = target - totalOfThis;
            let adjustedPackLimit = packLimit - greatestPossible;

            let result = {};

            if (siblingTarget === 0 || adjustedPackLimit === 0) {
                result = {
                    total: totalOfThis, qty: greatestPossible, packs: currentRow
                };
                if (siblingTarget === 0) {
                    nearestTotal = result.total;
                    bestQty = result.qty;
                    bestRow = {...result.packs};
                    break;
                }
            } else {

                if (canUseCache(nextPointer, siblingTarget, adjustedPackLimit, cache)) {
                    result = {...cache[nextPointer][siblingTarget]};
                    result.total += totalOfThis;
                    result.qty += greatestPossible;
                    result.packs[pointer] = greatestPossible;
                    setCache(result, pointer, result.total, cache);
                } else {
                    if (siblingTarget === 0) {
                        result = {
                            total: totalOfThis, qty: greatestPossible, packs: {
                                [pointer]: greatestPossible
                            }
                        };
                    } else {
                        result = getBestPacksForQuantity(siblingTarget, packsAvailable, nextPointer, cache, adjustedPackLimit, efficientPackLimit, {...currentRow});
                        result.total += totalOfThis;
                        result.qty += greatestPossible;
                        result.packs[pointer] = greatestPossible;
                        setCache(result, pointer, result.total, cache, packLimit);
                    }

                }
            }

            //if the combination with this amount of this pack is best yet, keep to return later
            let bestTotalWithThisQty = result.total;
            if (bestTotalWithThisQty > nearestTotal || (bestTotalWithThisQty === nearestTotal && result.qty < bestQty)) {
                nearestTotal = result.total;
                bestQty = result.qty;
                bestRow = {...result.packs};
            }

            greatestPossible--;

        }

        //return the best combo
        return {
            total: nearestTotal, qty: bestQty, packs: bestRow
        };

    }

};

/**
 * Decides whether or not a cached result is improvable
 * @param nextPointer
 * @param siblingTarget
 * @param adjustedPackLimit
 * @param cache
 * @returns {boolean}
 */
const canUseCache = (nextPointer, siblingTarget, adjustedPackLimit, cache) => {

    let cacheSet = cache[nextPointer][siblingTarget] !== -1;
    if (!cacheSet) return false;

    let cacheIsExact = cache[nextPointer][siblingTarget].total === siblingTarget;
    let haveMorePacks = adjustedPackLimit >= cache[nextPointer][siblingTarget].packLimit;
    return (cacheIsExact || (!cacheIsExact && !haveMorePacks));
};

/**
 * Adds copies of objects to the cache
 * @param result
 * @param pointer
 * @param target
 * @param cache
 * @param packLimit
 */
const setCache = (result, pointer, target, cache, packLimit) => {
    cache[pointer][target] = Object.assign(result, {packLimit});
};

/**
 * Finds the minimum value of the overall pack limit, the most efficient limit for this pack, or the amount of packs required to fulfill the target
 * @param target
 * @param packSize
 * @param packLimit
 * @param efficientLimit
 * @returns {number}
 */
const getMaxUses = (target, packSize, packLimit, efficientLimit) => {
    return Math.min(Math.floor(target / packSize), packLimit, efficientLimit);
};

/**
 * Compares all items against all of those before unless the item is found to be a factor of any multiple of one before.
 * If it is, that multiplier is returned as a max efficient value to use, as any more than that could equal a lower factor or a greater pack
 * @param packs
 * @param orderSize
 */
const getFactorLimits = (packs, orderSize) => {

    const lookBehind = (pointer, orderSize, packs) => {

        for (let previousPackPointer = pointer - 1; previousPackPointer >= 0; previousPackPointer--) {

            let sumOfPreviousQuantites = 0;

            while (sumOfPreviousQuantites < orderSize) {
                sumOfPreviousQuantites += packs[previousPackPointer];
                if (sumOfPreviousQuantites % packs[pointer] === 0) {
                    //stop the first time this happens
                    return sumOfPreviousQuantites / packs[pointer];
                }
            }
        }

    };

    let maxEffective = {};
    for (let pointer = packs.length - 1; pointer > 0; pointer--) {
        maxEffective[pointer] = lookBehind(pointer, orderSize, packs);
    }

    return maxEffective;
};

/**
 * Builds an empty cache
 * An array for each pack pointer, each containing an array of -1 to quantity equal to the order size
 * @param packs
 * @param orderSize
 * @returns {Array}
 */
const createCache = (packs, orderSize) => {
    let [cache, sizeArray] = [[], []];
    for (let i = 0; i <= orderSize; i++) {
        sizeArray.push(-1);
    }

    for (let i = 0; i < packs.length; i++) {
        cache.push(sizeArray);
    }

    return cache;
};

/**
 * Returns the best achievable order size with lowest amount of packs, from given packs and total
 * @param orderSize
 * @param packs
 * @returns {Promise<{}>|{total: number, qty: number, packs: {}}}
 */
const getBestPacks = (orderSize, packs) => {
    if (isNaN(orderSize) || !Array.isArray(packs) || packs.length === 0) {
        return {
            total: 0, qty: 0, packs: {}
        };
    }

    for (let i = 0; i < packs.length; i++) {
        if (isNaN(packs[i])) {
            return {
                total: 0, qty: 0, packs: {}
            };
        } else {
            packs[i] = parseInt(packs[i]);
        }
    }

    orderSize = parseInt(orderSize);

    const maxEfficientUses = getFactorLimits(packs, orderSize);
    const achievable = getAchievableOrderSizeAndBestGuessPacks(orderSize, packs);
    let cache = createCache(packs, achievable.target);
    return new Promise(resolve => {
        resolve(getBestPacksForQuantity(achievable.target, packs, 0, cache, achievable.amountOfPacks, maxEfficientUses));
    });
};

export default getBestPacks;
