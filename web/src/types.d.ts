declare module '@stacks/connect' {
  export function openContractCall(opts: any): any;
}

declare module '@stacks/network' {
  export class StacksTestnet { constructor(); }
  export class StacksMainnet { constructor(); }
}

declare module '@stacks/transactions' {
  export function callReadOnlyFunction(opts: any): Promise<any>;
  export function cvToValue(cv: any): any;
}

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS?: string
  readonly VITE_CONTRACT_NAME?: string
  readonly VITE_MAINNET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
