import fs from 'fs';
import YAML from 'js-yaml';

export const swaggerDocument: any = YAML.load(fs.readFileSync('docs/api-docs.yml').toString());
