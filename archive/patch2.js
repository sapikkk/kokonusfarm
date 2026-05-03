const fs = require('fs');
const file = 'src/app/(dashboard)/admin/active-production/page.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /<p className="text-xs text-muted-foreground">Tahap awal persemaian<\/p>/,
  '<p className="text-xs text-muted-foreground">Bibit disemai (base unit)</p>'
);
data = data.replace(
  /<p className="text-xs text-muted-foreground">Pembesaran bibit<\/p>/,
  '<p className="text-xs text-muted-foreground">Total tanaman (base unit)</p>'
);
data = data.replace(
  /<p className="text-xs text-muted-foreground">Proses pematangan menuju panen<\/p>/,
  '<p className="text-xs text-muted-foreground">Total tanaman (base unit)</p>'
);

fs.writeFileSync(file, data);
console.log('done patching labels in admin');
