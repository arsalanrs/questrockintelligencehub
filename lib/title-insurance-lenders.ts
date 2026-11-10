export type TitleInsuranceLender = {
  id: string;
  name: string;
  /** Default selection on Processing Resources → Title & Insurance */
  isDefault?: boolean;
  lossPayeeLabel: string;
  lossPayee: string[];
  titleLabel: string;
  title: string[];
  fhaLenderId?: string;
  vaLenderId?: string;
  clauseNote?: string;
};

export const TITLE_INSURANCE_LENDERS: TitleInsuranceLender[] = [
  {
    id: 'questrock',
    name: 'QuestRock',
    isDefault: true,
    lossPayeeLabel: 'Hazard Insurance Mortgagee / Loss Payee',
    lossPayee: [
      'QuestRock, LLC',
      'ISAOA/ATIMA',
      '695 Mansell Road, Suite 250',
      'Roswell, GA 30076',
    ],
    titleLabel: 'Title / CPL Mortgagee Clause',
    title: [
      'QuestRock, LLC',
      'ISAOA/ATIMA',
      '695 Mansell Road, Suite 250',
      'Roswell, GA 30076',
    ],
    fhaLenderId: '0120500005',
  },
  {
    id: 'loanunited',
    name: 'LoanUnited',
    lossPayeeLabel: 'Hazard Insurance Mortgagee / Loss Payee',
    lossPayee: [
      'LoanUnited.com, LLC',
      'ISAOA/ATIMA',
      '3235 Satellite Blvd, Suite 314',
      'Duluth, GA 30096',
    ],
    titleLabel: 'Title / CPL Mortgagee Clause',
    title: [
      'LoanUnited.com, LLC',
      'ISAOA/ATIMA',
      '3235 Satellite Blvd, Suite 314',
      'Duluth, GA 30096',
    ],
    vaLenderId: '6492270000',
  },
  {
    id: 'deephaven',
    name: 'DeepHaven',
    lossPayeeLabel: 'Loss Payee Clause (Hazard and Flood Insurance)',
    lossPayee: [
      'Selene Finance',
      'Its Successors and/or Assigns ATIMA',
      'P.O. Box 461470',
      'San Antonio, TX 78246',
    ],
    titleLabel: 'Title Policy Insured Name',
    title: [
      'Deephaven Mortgage LLC',
      'Its Successors and/or Assigns ATIMA',
      '3530 Toringdon Way, Suite 300',
      'Charlotte, NC 28277',
    ],
  },
  {
    id: 'lendsure',
    name: 'LendSure',
    lossPayeeLabel: 'Hazard Insurance Mortgagee Clause',
    lossPayee: [
      'Cornerstone Servicing ISAOA/ATIMA',
      'PO Box 961254',
      'Fort Worth, TX 76161',
    ],
    titleLabel: 'Title and CPL Mortgagee Clause',
    title: [
      'LendSure Mortgage Corp.',
      'ISAOA',
      '12230 World Trade Drive, Suite 250',
      'San Diego, CA 92128',
    ],
  },
  {
    id: 'averra',
    name: 'Averra',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: [
      'Confirm with investor guideline — clause not loaded in Hub yet.',
      'Use Averra FHA/VA/Conventional/DSCR overlay for servicer name.',
    ],
    titleLabel: 'Title mortgagee / insured',
    title: [
      'Confirm with investor guideline — clause not loaded in Hub yet.',
    ],
    clauseNote: 'Submit verified clause from Averra overlay to processing to add here.',
  },
  {
    id: 'champions',
    name: 'Champions Funding',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with Champions Funding — not in pilot PDF extract.'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with Champions Funding — not in pilot PDF extract.'],
    clauseNote: 'Matrix sheets in corpus; CPL text not extracted.',
  },
  {
    id: 'clearedge',
    name: 'Clear Edge',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with Clear Edge investor package.'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with Clear Edge investor package.'],
  },
  {
    id: 'elend',
    name: 'eLEND',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with eLEND guideline / title package.'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with eLEND guideline / title package.'],
  },
  {
    id: 'limaone',
    name: 'Lima One',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with Lima One broker guidelines (bridge / fix & flip / GUC).'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with Lima One broker guidelines.'],
  },
  {
    id: 'loanstream',
    name: 'LoanStream',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with LoanStream investor — matrix in Hub corpus only.'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with LoanStream investor.'],
  },
  {
    id: 'nqm-funding',
    name: 'NQM Funding',
    lossPayeeLabel: 'Hazard / Flood loss payee',
    lossPayee: ['Confirm with NQM Funding NonQM / DSCR underwriting guide.'],
    titleLabel: 'Title mortgagee clause',
    title: ['Confirm with NQM Funding underwriting guide.'],
  },
  {
    id: 'aven',
    name: 'AVEN',
    lossPayeeLabel: 'HELOC / hazard',
    lossPayee: ['AVEN HELOC — confirm loss payee with investor (summary sheet in corpus).'],
    titleLabel: 'Title / mortgagee',
    title: ['AVEN HELOC — confirm with investor.'],
  },
];

export function defaultTitleInsuranceLenderId(): string {
  return TITLE_INSURANCE_LENDERS.find((row) => row.isDefault)?.id ?? TITLE_INSURANCE_LENDERS[0].id;
}
