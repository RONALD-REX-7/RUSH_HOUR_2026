const fs = require('fs');
const p = 'src/context/AppContext.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/const updateProblemStatus = async \([^]*?await fetchAllData\(\);\n  \};/m, 
`const updateProblemStatus = async (problemId: string, status: ProblemStatus) => {
    await citizenApi.updateProblem(problemId, { status });
    await fetchAllData();
  };`);

fs.writeFileSync(p, c);
