/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as blueair from "../blueair.js";
import type * as govee from "../govee.js";
import type * as homeassistant from "../homeassistant.js";
import type * as http from "../http.js";
import type * as hue from "../hue.js";
import type * as keys from "../keys.js";
import type * as openapi from "../openapi.js";
import type * as smartthings from "../smartthings.js";
import type * as tokens from "../tokens.js";
import type * as userKeys from "../userKeys.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blueair: typeof blueair;
  govee: typeof govee;
  homeassistant: typeof homeassistant;
  http: typeof http;
  hue: typeof hue;
  keys: typeof keys;
  openapi: typeof openapi;
  smartthings: typeof smartthings;
  tokens: typeof tokens;
  userKeys: typeof userKeys;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
