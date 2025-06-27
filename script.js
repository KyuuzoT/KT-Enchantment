document.addEventListener('DOMContentLoaded', () => {
    const rarityButtons = document.querySelectorAll('[data-rarity]');
    const supplements = document.getElementById('supplements');
    const chanceTable = document.getElementById('chance-table');
    const maxChance = 80

    const rarityWithSupplements = ['Fabled', 'Eternal', 'Mythic'];
    let selectedRarity = document.querySelector('[data-rarity].active')?.getAttribute('data-rarity') || null

    const getSupplementsState = (selectedRarity) => {
        if (selectedRarity) {
            supplements.disabled = !rarityWithSupplements.includes(selectedRarity);
            if (supplements.disabled) {
                supplements.value = "No Supplements";
                supplementGrade = 0;
                updateTable();
            }
        }
    }

    const getSupplementGrade = (supplement) => {
        const supplementGrades = {
            'no supplements': 0,
            'lesser': 5,
            'normal': 10,
            'greater': 15
        }

        console.log(supplement, supplement.toLowerCase(), supplementGrades[supplement.toLowerCase()])
        return supplementGrades[supplement.toLowerCase()]
    }

    rarityButtons.forEach(button => {
        button.addEventListener('click', () => {
            rarityButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            selectedRarity = button.getAttribute('data-rarity');
            getSupplementsState(selectedRarity)
        });
    });

    const itemLevel = document.getElementById('item-level');
    const itemLevelNum = document.getElementById('item-level-num');
    const enchantLevel = document.getElementById('enchant-level');
    const enchantLevelNum = document.getElementById('enchant-level-num');

    function syncInputs(range, number) {
        range.addEventListener('input', () => {
            updateTable()
            return number.value = range.value
        });
        number.addEventListener('input', () => {
            range.value = number.value;
            updateTable();
        });
    }

    syncInputs(itemLevel, itemLevelNum);
    syncInputs(enchantLevel, enchantLevelNum);

    const supplementDropdown = document.getElementById("supplements")
    let supplementGrade = getSupplementGrade(supplementDropdown.value)
    console.log(supplementDropdown.value, supplementGrade)
    supplementDropdown.addEventListener("change", () => {
        supplementGrade = getSupplementGrade(supplementDropdown.value)
    })



    const getGradeLevelValue = (itemRarity) => {
        const gradeLevels = {
            'common': 0,
            'superior': 10,
            'heroic': 20,
            'fabled': 30,
            'eternal': 40,
            'Mythic': 50
        }

        return gradeLevels[itemRarity.toLowerCase()]
    }

    const calculateChance = (requiredEnchantmentLevel, stoneLevel, supplementGrade) => {
        //console.log(stoneLevel, requiredEnchantmentLevel, (stoneLevel / requiredEnchantmentLevel))
        const baseChance = Math.round((stoneLevel / requiredEnchantmentLevel) * maxChance)
        return baseChance >= maxChance ? maxChance : baseChance + supplementGrade
    }

    function updateTable() {
        const itemLevel = +itemLevelNum.value
        const enchantLevel = +enchantLevelNum.value
        const gradeLevel = +getGradeLevelValue(selectedRarity)
        const requiredEnchantmentLevel = itemLevel + enchantLevel + gradeLevel;
        const supplementGrade = getSupplementGrade(supplementDropdown.value);


        console.log(requiredEnchantmentLevel)
        const chances = {};
        for (let index = itemLevel; index < requiredEnchantmentLevel + 5; index++) {
            const baseChance = Math.round((index * maxChance) / requiredEnchantmentLevel);
            const finalChance = baseChance >= maxChance ? maxChance : baseChance + supplementGrade;
            chances[index] = finalChance;
        }
        // const chances = {}
        // for (let index = itemLevel; index < requiredEnchantmentLevel + 5; index++) {
        //     // if (!chances[index]) {
        //     //     chances[index] = []
        //     // }

        //     const chance = calculateChance(requiredEnchantmentLevel, index, +supplementGrade)
        //     //console.log(`${index}: ${chance}`)
        //     chances[index] = chance
        // }

        chanceTable.innerHTML = '';
        Object.entries(chances).forEach(([stone, chance]) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${stone}</td><td>${chance}%</td>`;
            chanceTable.appendChild(row);
        });
    }

    updateTable();
});