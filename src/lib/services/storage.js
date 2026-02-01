import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VALIDATIONS_FILE = path.join(DATA_DIR, 'validations.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

async function readValidations() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(VALIDATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { validations: [] };
  }
}

async function writeValidations(data) {
  await ensureDataDir();
  await fs.writeFile(VALIDATIONS_FILE, JSON.stringify(data, null, 2));
}

export async function saveValidation(idea, result) {
  const data = await readValidations();
  
  const validation = {
    id: Date.now().toString(),
    idea,
    result,
    createdAt: new Date().toISOString(),
  };
  
  data.validations.unshift(validation);
  
  // Keep only last 50 validations
  data.validations = data.validations.slice(0, 50);
  
  await writeValidations(data);
  return validation;
}

export async function getValidations() {
  const data = await readValidations();
  return data.validations;
}

export async function getValidation(id) {
  const data = await readValidations();
  return data.validations.find(v => v.id === id);
}
