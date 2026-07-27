
import { ActionFunctionArgs, LoaderFunctionArgs, RouterContextProvider } from "../router/utils.js";
import { AssetsManifest, CriticalCss, EntryContext, FutureConfig, SerializeErrorFunction } from "../dom/ssr/entry.js";
import { ServerRouteManifest } from "./routes.js";
import { ServerInstrumentation } from "../router/instrumentation.js";

//#region lib/server-runtime/build.d.ts
type OptionalCriticalCss = CriticalCss | undefined;
/**
 * The output of the compiler for the server build.
 */
interface ServerBuild {
  entry: {
    module: ServerEntryModule;
  };
  routes: ServerRouteManifest;
  assets: AssetsManifest;
  basename?: string;
  publicPath: string;
  assetsBuildDirectory: string;
  future: FutureConfig;
  ssr: boolean;
  unstable_getCriticalCss?: (args: {
    pathname: string;
  }) => OptionalCriticalCss | Promise<OptionalCriticalCss>;
  /**
   * @deprecated This is now done via a custom header during prerendering
   */
  isSpaMode: boolean;
  prerender: string[];
  routeDiscovery: {
    mode: "lazy" | "initial";
    manifestPath: string;
  };
  allowedActionOrigins?: string[] | false;
}
interface HandleDocumentRequestFunction {
  (request: Request, responseStatusCode: number, responseHeaders: Headers, context: EntryContext, loadContext: RouterContextProvider): Promise<Response> | Response;
}
interface HandleDataRequestFunction {
  (response: Response, args: {
    request: LoaderFunctionArgs["request"] | ActionFunctionArgs["request"];
    context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"];
    params: LoaderFunctionArgs["params"] | ActionFunctionArgs["params"];
  }): Promise<Response> | Response;
}
interface HandleErrorFunction {
  (error: unknown, args: {
    request: LoaderFunctionArgs["request"] | ActionFunctionArgs["request"];
    context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"];
    params: LoaderFunctionArgs["params"] | ActionFunctionArgs["params"];
  }): void;
}
/**
 * A module that serves as the entry point for a Remix app during server
 * rendering.
 */
interface ServerEntryModule {
  default: HandleDocumentRequestFunction;
  handleDataRequest?: HandleDataRequestFunction;
  handleError?: HandleErrorFunction;
  /**
   * Optional hook to customize how errors are serialized on the server before
   * they are streamed to the client for hydration/data requests. Pair this with
   * `unstable_deserializeError` on `<HydratedRouter>` in your `entry.client`
   * module. See {@link SerializeErrorFunction}.
   */
  unstable_serializeError?: SerializeErrorFunction;
  instrumentations?: ServerInstrumentation[];
  streamTimeout?: number;
}
//#endregion
export { HandleDataRequestFunction, HandleDocumentRequestFunction, HandleErrorFunction, ServerBuild, ServerEntryModule };