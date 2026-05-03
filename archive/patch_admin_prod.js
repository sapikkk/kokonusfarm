const fs = require('fs');
const file = 'src/app/(dashboard)/admin/active-production/page.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  'const semai = activeCycles.filter(c => c.phase === "SEMAI").length',
  'const semai = activeCycles.filter(c => c.phase === "SEMAI").reduce((sum, c) => sum + c.currentQuantity, 0)'
);
data = data.replace(
  'const bibit = activeCycles.filter(c => c.phase === "BIBIT").length',
  'const bibit = activeCycles.filter(c => c.phase === "BIBIT").reduce((sum, c) => sum + c.currentQuantity, 0)'
);
data = data.replace(
  'const tanam = activeCycles.filter(c => c.phase === "TANAM").length',
  'const tanam = activeCycles.filter(c => c.phase === "TANAM").reduce((sum, c) => sum + c.currentQuantity, 0)'
);
fs.writeFileSync(file, data);
