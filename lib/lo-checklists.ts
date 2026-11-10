export const LOAN_PROGRAMS = [
  'Conventional',
  'FHA',
  'VA',
  'USDA',
  'NQM Bank Statement',
  'NQM 1099',
  'NQM Full Doc',
  'NQM No Income Doc',
  'NQM Asset Utilization',
  'DSCR',
  'Bridge',
  'Fix & Flip',
  'Ground-Up Construction',
] as const;

export const LOAN_PURPOSES = ['Purchase', 'Refinance'] as const;

export const AGENCY_INCOME_TYPES = [
  'W-2 / Salary / Hourly',
  'Self-employed / Tax returns',
  'Retirement / Social Security',
  'Assets',
] as const;

export const BANK_STATEMENT_MONTHS = ['12 months', '24 months'] as const;

export type LoanProgram = (typeof LOAN_PROGRAMS)[number];
export type LoanPurpose = (typeof LOAN_PURPOSES)[number];
export type ChecklistAudience = 'lo' | 'processing';
export type AgencyIncomeType = (typeof AGENCY_INCOME_TYPES)[number];
export type BankStatementMonths = (typeof BANK_STATEMENT_MONTHS)[number];

export type ChecklistFilters = {
  incomeType?: AgencyIncomeType;
  bankStatementMonths?: BankStatementMonths;
};

const SPECIALTY_PROGRAMS = new Set<LoanProgram>(['Bridge', 'Fix & Flip', 'Ground-Up Construction']);

const AGENCY_PROGRAMS = new Set<LoanProgram>(['Conventional', 'FHA', 'VA', 'USDA']);

function isNqm(program: LoanProgram) {
  return program.startsWith('NQM') || program === 'DSCR';
}

function usesAgencyIncome(program: LoanProgram) {
  return AGENCY_PROGRAMS.has(program);
}

function unique(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function agencyIncomeDocs(income: AgencyIncomeType, audience: ChecklistAudience): string[] {
  const processing = audience === 'processing';
  switch (income) {
    case 'W-2 / Salary / Hourly':
      return ['Most recent 30 days of paystubs', 'W-2s for the last 2 years'];
    case 'Self-employed / Tax returns':
      return [
        'Most recent 2 years personal tax returns (all schedules)',
        'Most recent 2 years business tax returns if applicable',
        ...(processing ? ['YTD profit & loss if overlay requires', 'Business license / CPA letter if required'] : []),
      ];
    case 'Retirement / Social Security':
      return [
        'Social Security award letter or 1099-SSA',
        'Pension or annuity award letter',
        '1099-R or bank statements showing retirement deposits',
      ];
    case 'Assets':
      return [
        '2 months asset statements (all pages)',
        ...(processing ? ['Asset depletion / utilization worksheet'] : []),
      ];
    default:
      return [];
  }
}

function programDocs(
  program: LoanProgram,
  purpose: LoanPurpose,
  audience: ChecklistAudience,
  filters: ChecklistFilters,
): string[] {
  const purchaseAssets =
    purpose === 'Purchase' || program === 'NQM Asset Utilization'
      ? ['2 months asset statements (all pages)']
      : [];
  const processing = audience === 'processing';
  const income: AgencyIncomeType = filters.incomeType ?? 'W-2 / Salary / Hourly';
  const bankMonths: BankStatementMonths = filters.bankStatementMonths ?? '12 months';

  if (usesAgencyIncome(program)) {
    if (program === 'VA' && income === 'W-2 / Salary / Hourly') {
      return ['Most recent LES or paystubs'];
    }
    return agencyIncomeDocs(income, audience);
  }

  switch (program) {
    case 'NQM Bank Statement':
      return [
        `${bankMonths} personal or business bank statements (all pages)`,
        'Business license or CPA letter if required',
        ...(processing ? ['P&L if overlay asks for it'] : []),
        '2 months reserve statements',
      ];
    case 'NQM 1099':
      return [
        'Most recent 1–2 years 1099s',
        ...(processing ? ['YTD income documentation'] : []),
        ...purchaseAssets,
      ];
    case 'NQM Full Doc':
      return [
        'Most recent 30 days of paystubs',
        '2 years tax returns (personal and business if applicable)',
        'W-2s or K-1s as applicable',
        ...purchaseAssets,
      ];
    case 'NQM No Income Doc':
      return processing
        ? [
            'Credit and asset package per overlay',
            'Occupancy / use of proceeds letter',
            'No income docs unless overlay requires residual income',
            'Reserves per program matrix',
          ]
        : [];
    case 'NQM Asset Utilization':
      return [
        'Asset statements covering the utilization lookback',
        ...(processing ? ['Seasoning / source of large deposits', 'Utilization worksheet'] : []),
        'Reserves after utilization',
      ];
    case 'DSCR':
      return [
        'Executed lease or market rent schedule',
        ...(processing ? ['DSCR worksheet / PITIA calc'] : []),
        'Property insurance and tax estimate',
        'Entity docs if vesting in an LLC',
      ];
    default:
      return [];
  }
}

function specialtyChecklist(
  program: LoanProgram,
  purpose: LoanPurpose,
  audience: ChecklistAudience,
): string[] {
  const processing = audience === 'processing';
  const items: string[] = ['Borrower + property applications'];

  if (purpose === 'Purchase') {
    items.push('Purchase + sale agreement');
  } else {
    items.push('Mortgage statement for subject property');
    if (processing) {
      items.push('Refinance authorization', 'Note / payoff authorization');
    }
  }

  if (processing) {
    items.push('Appraisal', 'Credit report', 'Title / CPL and settlement package');
  }

  items.push(
    'Photo ID for guarantors',
    'Articles of Organization',
    'Operating Agreement / Bylaws',
    'Corporate resolution',
    'Certificate of Good Standing',
    'EIN documentation',
    'Assets — previous 60 days (all pages)',
    'Property insurance',
    'Schedule of real estate owned',
  );

  if (program === 'Fix & Flip' || program === 'Ground-Up Construction') {
    items.push('Construction budget');
  }

  if (program === 'Ground-Up Construction') {
    items.push(
      'Contractor bio form',
      'Contractor photo ID',
      'Contractor certificate of liability insurance',
      'Contractor license',
      'Builder permits',
      'Construction plans',
    );
  }

  return unique(items);
}

export function checklistItems(
  program: LoanProgram,
  purpose: LoanPurpose,
  audience: ChecklistAudience = 'lo',
  filters: ChecklistFilters = {},
): string[] {
  if (SPECIALTY_PROGRAMS.has(program)) {
    return specialtyChecklist(program, purpose, audience);
  }

  const processing = audience === 'processing';
  const dscr = program === 'DSCR';
  const items: string[] = ['Borrower government-issued photo ID'];

  if (processing) {
    items.push(
      'Completed 1003 / URLA',
      'Credit report / tri-merge authorization',
      'Appraisal order or received appraisal',
      'Title / settlement estimate',
    );
  }

  if (purpose === 'Purchase') {
    items.push('Fully executed purchase contract', 'Earnest money proof');
    if (processing) {
      items.push('HOA docs if applicable');
    }
  } else {
    items.push('Mortgage statement for subject property');
    if (processing) {
      items.push(
        'Refinance authorization',
        'Note / payoff authorization',
        'Purpose of refinance (rate/term or cash-out)',
      );
    }
  }

  if (!dscr) {
    items.push(
      'Mortgage statement for all owned homes with a balance',
      'Homeowners insurance for all owned homes',
    );
  }

  if (usesAgencyIncome(program)) {
    if (program === 'FHA' && processing) {
      items.push('FHA case number / CAIVRS screening');
    }
    if (program === 'VA' && processing) {
      items.push('Certificate of Eligibility', 'DD-214 or statement of service');
    }
    if (program === 'USDA' && processing) {
      items.push('USDA eligibility / income limit confirmation');
    }
  }

  if (isNqm(program) && !dscr) {
    items.push('Business narrative');
  }

  items.push(...programDocs(program, purpose, audience, filters));
  return unique(items);
}

export function showIncomeTypeFilter(program: LoanProgram): boolean {
  return usesAgencyIncome(program);
}

export function showBankStatementMonthsFilter(program: LoanProgram): boolean {
  return program === 'NQM Bank Statement';
}
