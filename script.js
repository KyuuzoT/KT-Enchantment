document.addEventListener('DOMContentLoaded', () => {
  const rarityButtons = document.querySelectorAll('[data-rarity]');
  const supplements = document.getElementById('supplements');
  const chanceTable = document.getElementById('chance-table');

  const rarityWithSupplements = ['Fabled', 'Eternal', 'Mythic'];

  rarityButtons.forEach(button => {
    button.addEventListener('click', () => {
      rarityButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selected = button.getAttribute('data-rarity');
      supplements.disabled = !rarityWithSupplements.includes(selected);
    });
  });

  const itemLevel = document.getElementById('item-level');
  const itemLevelNum = document.getElementById('item-level-num');
  const enchantLevel = document.getElementById('enchant-level');
  const enchantLevelNum = document.getElementById('enchant-level-num');

  function syncInputs(range, number) {
    range.addEventListener('input', () => number.value = range.value);
    number.addEventListener('input', () => range.value = number.value);
  }

  syncInputs(itemLevel, itemLevelNum);
  syncInputs(enchantLevel, enchantLevelNum);

  function updateTable() {
    const baseChances = {
      65: 0, 64: 1, 63: 2, 62: 4, 61: 7, 60: 10,
      59: 15, 58: 20, 57: 35, 56: 40, 55: 45,
      54: 50, 53: 55, 52: 60
    };
    chanceTable.innerHTML = '';
    Object.entries(baseChances).forEach(([stone, chance]) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${stone}</td><td>${chance}%</td>`;
      chanceTable.appendChild(row);
    });
  }

  updateTable();
});