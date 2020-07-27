export function sliceAddress(address) {
    return address && `${address.slice(0,6)}...${address.slice(-4)}`
}

export function percent(number, digits=2) {
    return number && parseFloat(number).toLocaleString("en", { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function secondsToDays(seconds) {
    return parseFloat(seconds) / 86400
}

export function tokenBalance(balance, decimals, digits=0) {
    return balance && decimals && (parseInt(balance) / 10 ** parseInt(decimals)).toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

/**
 * @notice Returns a hard-coded image for a contract address
 * @param {string} address 
 */
export function imageForContract(address) {
    const images = {
        "0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Greater_coat_of_arms_of_the_United_States_%28monochrome%29.svg/500px-Greater_coat_of_arms_of_the_United_States_%28monochrome%29.svg.png",
        "0x03b2724fd50f62122a355ba3226ad8c15ec26bbc": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Seal_of_the_United_States_Department_of_Education.svg/500px-Seal_of_the_United_States_Department_of_Education.svg.png",
        "0x27865c9fadff972e28786125cee417f56864e169": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Seal_of_the_United_States_Department_of_the_Interior.svg/500px-Seal_of_the_United_States_Department_of_the_Interior.svg.png",
        "0x293ae161ed6e5cf7419144067c662068bb2a4bd2": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_States_Department_of_Defense_Seal.svg/500px-United_States_Department_of_Defense_Seal.svg.png",
        "0xc753e572262cf87c927276cfceb288530873f958": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Seal_of_the_United_States_Environmental_Protection_Agency.svg/500px-Seal_of_the_United_States_Environmental_Protection_Agency.svg.png",
        "0xcb4656aa9da9f5399e5066925e7a5924ebf9df4f": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Seal_of_the_Executive_Office_of_the_President_of_the_United_States_2014.svg/500px-Seal_of_the_Executive_Office_of_the_President_of_the_United_States_2014.svg.png"
    }

    return images[address.toLowerCase()] 
}

export function nameForContract(address) {
    const names = {
        "0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0": "Liquid America",
    }

    return names[address.toLowerCase()]
}