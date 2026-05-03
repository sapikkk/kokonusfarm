const fs = require('fs');
const file = 'src/app/api/harvest-reports/[id]/estimate/route.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  'const session = await getServerSession(authOptions)',
  'const session = await getServerSession(authOptions)\n  console.log("ESTIMATE API SESSION:", JSON.stringify(session))'
);

fs.writeFileSync(file, data);
