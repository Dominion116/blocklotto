declare module 'https://deno.land/x/clarinet@v1.0.8/index.ts' {
  // Runtime values (for imports)
  export const Clarinet: any;
  export const Tx: any;
  export const Chain: any;
  export const Account: any;
  export const types: any;

  // Type aliases so the test files can use these as types
  export type Chain = any;
  export type Account = any;

  export default Clarinet;
}
