/**
 * Include any global TypeScript types or modules here
 */

type Empty = null | undefined;

type Maybe<T> = T | Empty;

type Nullable<T> = T | null;

type Result<T> = T | null;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/* Catch-all type for React Children */
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | string
  | null
  | undefined;

/* Attach Segment analytics module to the global window object */
interface Window {
  USB?: any;
  u2f?: any;
  analytics: SegmentAnalytics.AnalyticsJS;
}

declare var window: Window;

declare module "crypto-js/enc-hex";
declare module "crypto-js/ripemd160";
declare module "crypto-js/sha256";
declare module "bip32";
declare module "bip39";
declare module "bech32";
declare module "secp256k1";
declare module "swipyjs";
declare module "ethereum-address";
declare module "@lunie/cosmos-ledger";
declare module "chinese-conv";
declare module "react-loader-spinner";
declare module "@ledgerhq/hw-app-eth";
declare module "@ledgerhq/hw-transport-u2f";
declare module "@ledgerhq/hw-transport-webusb";
declare module "react-syntax-highlighter/dist/esm/styles/hljs";
declare module "react-syntax-highlighter/dist/esm/styles/prism";
