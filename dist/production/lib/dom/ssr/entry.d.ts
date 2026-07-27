
import { DataRouteObject, RouteBranch, RouteManifest } from "../../router/utils.js";
import { StaticHandlerContext } from "../../router/router.js";
import { RouteModules } from "./routeModules.js";
import { EntryRoute } from "./routes.js";
import { ServerBuild } from "../../server-runtime/build.js";

//#region lib/dom/ssr/entry.d.ts
type SerializedError = {
  message: string;
  stack?: string;
};
/**
 * Hook to customize how errors are serialized on the server before they are
 * streamed to the client. Exported (as `unstable_serializeError`) from your
 * `entry.server` module.
 *
 * Return a JSON/turbo-stream-serializable value to send to the client (it will
 * be handed to your `unstable_deserializeError` on the client), or `undefined`
 * to fall back to React Router's default error serialization.
 *
 * NOTE: When you provide this hook, React Router will *not* sanitize errors it
 * hands to you (so you receive the original error rather than a generic
 * "Unexpected Server Error").  You are responsible for stripping any sensitive
 * information (e.g. `stack`) that you don't want to leak to the client.
 */
type SerializeErrorFunction = (error: unknown) => unknown;
/**
 * Hook to customize how errors are deserialized on the client from the payload
 * produced by {@link SerializeErrorFunction} on the server. Passed to
 * `<HydratedRouter unstable_deserializeError>` in your `entry.client` module.
 *
 * Return the reconstructed error (typically an `Error` instance), or `undefined`
 * to leave the raw serialized payload as-is.
 */
type DeserializeErrorFunction = (serialized: unknown) => unknown;
interface FrameworkContextObject {
  manifest: AssetsManifest;
  routeModules: RouteModules;
  criticalCss?: CriticalCss;
  serverHandoffString?: string;
  future: FutureConfig;
  ssr: boolean;
  isSpaMode: boolean;
  routeDiscovery: ServerBuild["routeDiscovery"];
  nonce?: string;
  serializeError?(error: Error): SerializedError;
  renderMeta?: {
    didRenderScripts?: boolean;
    streamCache?: Record<number, Promise<void> & {
      result?: {
        done: boolean;
        value: string;
      };
      error?: unknown;
    }>;
  };
}
interface EntryContext extends FrameworkContextObject {
  branches: RouteBranch<DataRouteObject>[];
  staticHandlerContext: StaticHandlerContext;
  serverHandoffStream?: ReadableStream<Uint8Array>;
}
type FutureConfig = Record<string, never>;
type CriticalCss = string | {
  rel: "stylesheet";
  href: string;
};
interface AssetsManifest {
  entry: {
    imports: string[];
    module: string;
  };
  routes: RouteManifest<EntryRoute>;
  url: string;
  version: string;
  hmr?: {
    timestamp?: number;
    runtime: string;
  };
  sri?: Record<string, string> | true;
}
//#endregion
export { AssetsManifest, CriticalCss, DeserializeErrorFunction, EntryContext, FrameworkContextObject, FutureConfig, SerializeErrorFunction };