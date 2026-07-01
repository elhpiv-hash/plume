/**
 * Static institution directory for the profile "University" autocomplete.
 *
 * This is a curated demo subset (popular institutions worldwide + Russia), not
 * an exhaustive registry. The `searchInstitutions` seam is what the UI depends
 * on — swap this array for a backend-backed search later and the picker keeps
 * working unchanged.
 */

export interface Institution {
  name: string;
  /** ISO-ish country hint, shown as a muted qualifier in the list. */
  country?: string;
}

export const UNIVERSITIES: readonly Institution[] = [
  // ── Russia ──
  { name: 'МГУ им. М. В. Ломоносова', country: 'Россия' },
  { name: 'СПбГУ', country: 'Россия' },
  { name: 'НИУ ВШЭ', country: 'Россия' },
  { name: 'МФТИ', country: 'Россия' },
  { name: 'МГТУ им. Н. Э. Баумана', country: 'Россия' },
  { name: 'НИЯУ МИФИ', country: 'Россия' },
  { name: 'ИТМО', country: 'Россия' },
  { name: 'МГИМО', country: 'Россия' },
  { name: 'РАНХиГС', country: 'Россия' },
  { name: 'НГУ', country: 'Россия' },
  { name: 'Университет Иннополис', country: 'Россия' },
  { name: 'РЭУ им. Г. В. Плеханова', country: 'Россия' },
  // ── United States ──
  { name: 'Massachusetts Institute of Technology', country: 'USA' },
  { name: 'Stanford University', country: 'USA' },
  { name: 'Harvard University', country: 'USA' },
  { name: 'California Institute of Technology', country: 'USA' },
  { name: 'Princeton University', country: 'USA' },
  { name: 'Yale University', country: 'USA' },
  { name: 'University of California, Berkeley', country: 'USA' },
  { name: 'Carnegie Mellon University', country: 'USA' },
  { name: 'Columbia University', country: 'USA' },
  { name: 'University of Chicago', country: 'USA' },
  // ── United Kingdom ──
  { name: 'University of Oxford', country: 'UK' },
  { name: 'University of Cambridge', country: 'UK' },
  { name: 'Imperial College London', country: 'UK' },
  { name: 'University College London', country: 'UK' },
  { name: 'The University of Edinburgh', country: 'UK' },
  { name: 'The London School of Economics', country: 'UK' },
  // ── Europe ──
  { name: 'ETH Zürich', country: 'Switzerland' },
  { name: 'EPFL', country: 'Switzerland' },
  { name: 'Technical University of Munich', country: 'Germany' },
  { name: 'Ludwig Maximilian University of Munich', country: 'Germany' },
  { name: 'Delft University of Technology', country: 'Netherlands' },
  { name: 'KTH Royal Institute of Technology', country: 'Sweden' },
  { name: 'Sorbonne University', country: 'France' },
  { name: 'Politecnico di Milano', country: 'Italy' },
  // ── Asia & Pacific ──
  { name: 'National University of Singapore', country: 'Singapore' },
  { name: 'Nanyang Technological University', country: 'Singapore' },
  { name: 'The University of Tokyo', country: 'Japan' },
  { name: 'Tsinghua University', country: 'China' },
  { name: 'Peking University', country: 'China' },
  { name: 'Seoul National University', country: 'South Korea' },
  { name: 'Indian Institute of Technology Bombay', country: 'India' },
  { name: 'The University of Melbourne', country: 'Australia' },
  { name: 'University of Toronto', country: 'Canada' },
  { name: 'McGill University', country: 'Canada' },
];

/** Case/diacritic-tolerant match used both for filtering and confirming a pick. */
function fold(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');
}

/**
 * The single seam the UI consumes. Returns institutions whose name contains the
 * query, prioritising prefix matches, capped at `limit`. An empty query returns
 * a small starter slice so the dropdown is never blank on focus.
 */
export function searchInstitutions(query: string, limit = 8): Institution[] {
  const q = fold(query);
  if (!q) return UNIVERSITIES.slice(0, limit);
  const starts: Institution[] = [];
  const contains: Institution[] = [];
  for (const item of UNIVERSITIES) {
    const name = fold(item.name);
    if (name.startsWith(q)) starts.push(item);
    else if (name.includes(q)) contains.push(item);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** True when the text exactly matches a known institution (a confirmed pick). */
export function isKnownInstitution(value: string): boolean {
  const v = fold(value);
  return UNIVERSITIES.some((item) => fold(item.name) === v);
}
