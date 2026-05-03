const fs = require('fs');
const file = 'src/app/api/harvest-reports/[id]/estimate/route.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  'if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {',
  'if (session.user?.role !== "ADMIN" && session.user?.role !== "OWNER") {\n    console.error("FORBIDDEN ROLE:", session.user?.role);\n'
);

data = 'export const dynamic = "force-dynamic";\n' + data;

fs.writeFileSync(file, data);
