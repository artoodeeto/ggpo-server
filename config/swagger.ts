import fs from 'fs';
import YAML from 'js-yaml';

export const swaggerDocument = YAML.load(fs.readFileSync('docs/api-docs.yml').toString());
