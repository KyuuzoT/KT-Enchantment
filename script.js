document.addEventListener('DOMContentLoaded', () => {
    const rarityButtons = document.querySelectorAll('[data-rarity]')
    const supplements = document.getElementById('supplements')
    const chanceTable = document.getElementById('chance-table')
    const maxChance = 80
    const maxStoneLvl = 130
    const minStoneLvl = 1
    const tableSize = 16 // The amount of rows including header row

    const rarityWithSupplements = ['Fabled', 'Eternal', 'Mythic']
    let selectedRarity = document.querySelector('[data-rarity].active')?.getAttribute('data-rarity') || null

    const getSupplementsState = (selectedRarity) => {
        if (selectedRarity) {
            supplements.disabled = !rarityWithSupplements.includes(selectedRarity)
            if (supplements.disabled) {
                supplements.value = "No Supplements"
                supplementGrade = 0
                updateTable()
            }
        }
    }

    const supplementGrades = {
        'no supplements': 0,
        'lesser': 5,
        'normal': 10,
        'greater': 15
    }

    const getSupplementGrade = (supplement) => supplementGrades[supplement.toLowerCase()] ?? 0

    rarityButtons.forEach(button => {
        button.addEventListener('click', () => {
            rarityButtons.forEach(btn => btn.classList.remove('active'))
            button.classList.add('active')

            selectedRarity = button.getAttribute('data-rarity')
            getSupplementsState(selectedRarity)
            updateTable()
        })
    })

    const itemLevel = document.getElementById('item-level')
    const itemLevelNum = document.getElementById('item-level-num')
    const enchantLevel = document.getElementById('enchant-level')
    const enchantLevelNum = document.getElementById('enchant-level-num')

    const syncInputs = (range, number) => {
        range.addEventListener('input', () => {
            number.value = range.value
            updateTable()
        })
        number.addEventListener('input', () => {
            range.value = number.value
            updateTable()
        })
    }

    syncInputs(itemLevel, itemLevelNum)
    syncInputs(enchantLevel, enchantLevelNum)

    const supplementDropdown = document.getElementById("supplements")
    let supplementGrade = getSupplementGrade(supplementDropdown.value)

    supplementDropdown.addEventListener("change", () => {
        supplementGrade = getSupplementGrade(supplementDropdown.value)
        updateTable()
    })



    const getGradeLevelValue = (itemRarity) => {
        const gradeLevels = {
            'common': 0,
            'superior': 10,
            'heroic': 20,
            'fabled': 30,
            'eternal': 40,
            'mythic': 50
        }

        return gradeLevels[itemRarity.toLowerCase()] ?? 0
    }

    const calculateChance = (requiredEnchantmentLevel, stoneLevel, supplementGrade) => {
        const denominator = requiredEnchantmentLevel > 0 ? requiredEnchantmentLevel : 1
        let baseChance = Math.round((stoneLevel / denominator) * maxChance)

        if (baseChance > maxChance) {
            baseChance = maxChance
        }

        let totalChance = baseChance + supplementGrade;
        if (totalChance > maxChance) {
            totalChance = maxChance
        }

        return totalChance
    }

    function updateTable() {
        const itemLevel = +itemLevelNum.value
        const enchantLevel = +enchantLevelNum.value
        const gradeLevel = +getGradeLevelValue(selectedRarity)
        const requiredEnchantmentLevel = itemLevel + enchantLevel + gradeLevel
        const supplementGrade = getSupplementGrade(supplementDropdown.value)

        let stoneLvlMaxChance = null
        for (let stoneLevel = minStoneLvl; stoneLevel <= maxStoneLvl; stoneLevel++) {
            let baseChance = calculateChance(requiredEnchantmentLevel, stoneLevel, 0)
            baseChance = Math.min(baseChance, maxChance)
            if (baseChance === maxChance) {
                stoneLvlMaxChance = stoneLevel
                break;
            }
        }

        if (stoneLvlMaxChance === null) {
            stoneLvlMaxChance = maxStoneLvl
        }

        const secondToLast = stoneLvlMaxChance
        const last = Math.min(stoneLvlMaxChance + 1, maxStoneLvl)

        // Reserve slots for bottom 2 rows
        const bodySize = tableSize - 2


        // Fill lower levels
        let lowerLevels = []
        for (let level = secondToLast - 1; level >= minStoneLvl; level--) {
            lowerLevels.unshift(level)
            if (lowerLevels.length >= bodySize) {
                break;
            }
        }

        // Fill higher levels if we still have rows left
        let higherLevels = []
        let nextLevel = secondToLast + 2
        while (lowerLevels.length + higherLevels.length < bodySize && nextLevel <= maxStoneLvl) {
            higherLevels.push(nextLevel)
            nextLevel++
        }

        const rows = [
            ...lowerLevels,
            ...higherLevels,
            secondToLast,
            last
        ].sort((a,b) => a-b)

        // Generate the table
        chanceTable.innerHTML = ''

        rows.forEach(stoneLevel => {
            let baseChance = calculateChance(requiredEnchantmentLevel, stoneLevel, 0)
            baseChance = Math.min(baseChance, maxChance)

            const totalChance = Math.min(baseChance + supplementGrade, maxChance + supplementGrade)

            const row = document.createElement('tr')
            row.innerHTML = `<td>${stoneLevel}</td><td>${totalChance}%</td>`
            chanceTable.appendChild(row)
        })
    }

    getSupplementsState(selectedRarity)
    updateTable()
})
