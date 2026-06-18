const fs = require('fs');
let data = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const newRoadmaps = fs.readFileSync('newRoadmaps.txt', 'utf8');

data = data.replace(/(export const MOCK_LEARNING_RESOURCES: MockLearningResource\[\] = \[[\s\S]*?\];\n)/, '$1\n' + newRoadmaps);

fs.writeFileSync('src/lib/mockData.ts', data);
