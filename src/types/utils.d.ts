

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

type AsProp<C extends React.ElementType> = {
  as?: C;
};

interface FormInputDataProps extends
React.ComponentPropsWithoutRef<"input"> {
    title?: string;
}

interface SubscriptionPlan {
  id?: string;
  deleted?: boolean;
  deletedOn?: any,
  created?: any,
  updated?: any,
  subscriptionType?: string,
  price?: number;
  services?: SubscriptionPlanServices[]
}

interface SubscriptionPlanServices {
  price?: number;
  type?: string;
}

interface SSlider {
  image?: "dev" | "client";
  name?: string;
  title?: string;
  infos?: string;
  initialItem?: JSX.Element[];
  items?: any[];
}

// Ticket Status
const status = {
    open: 'Open',
    pending:  'Pending',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Not Resolved'
} as const;

type TicketStatus = Enum<typeof status>;

// action Status
const actionstatus = {
  active: 'Active',
  inactive:  'Inactive',
  valid:"VALID",
  blocked:"BLOCK",
  closed:'CLOSE'
} as const;

type ActionStatus = Enum<typeof actionstatus>;

// verification Status
const verifstatus = {
  verified: 'Verified',
  pending: 'PENDING',
  denied: 'Denied',
  complete:'COMPLETED',
  block:'BLOCK'
} as const;

type VerifiedStatus = Enum<typeof verifstatus>;


// Open Status
const accountstatus = {
  open: 'OPEN',
  frozen:'FROZEN',
  close: 'CLOSE',
  pending:  'Pending',
} as const;

type AccountStatus = Enum<typeof accountstatus>;

const accountAdminstatus = {
  valid: 'VALID',
  block:  'BLOCK',
  close: 'CLOSE',
} as const;

type AccountAdminStatus = Enum<typeof accountAdminstatus>;


// transaction Status
const transactionstatus = {
  success: 'Success',
  failed: 'Failed',
  valid:'VALID',
  close:'CLOSE',
  block:'BLOCK'
} as const;

type TransactionStatus = Enum<typeof transactionstatus>;


// session Status
const sessionstatus = {
  success: 'Active',
  failed: 'Expired',
} as const;

type SessionStatus = Enum<typeof sessionstatus>;

type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  display?: boolean;
  sortable?: boolean;
  sortMode?: "asc" | "desc";
  filerable?: boolean;
  className?: string;
  rowType?: "money" | "copy"
  rawData?: any;
  linkedUrl?: string
};

interface EmptyStatesProps {
  image?: string;
  title?: string;
  subTitle?: string;
  buttonText?: string;
  onButtonClick?: React.EventHandler<any>;
  size: "sm" | "lg"
}

type ComponentStatus = {
  onLoading?: boolean;
  onError?: boolean;
  onErrorCode?: boolean;
  onSuccess?: boolean;
}

type CustomerStatus = Enum<typeof customerstatus>;

// verification Status
const customerstatus = {
  valid: 'VALID',
  close: 'CLOSE',
  block: 'BLOCK'
} as const;

type Enum<T> = T[keyof T];

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = Omit<
  React.PropsWithChildren<AsProp<C>>,
  keyof Props
> &
  Props &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : T;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
          DotNestedKeys<T[K]>
        >}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;
