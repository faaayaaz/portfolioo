import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
export function render(url: string, siteOrigin: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = "";
    const stream = new PassThrough();
    stream.on("data", (chunk) => {
      output += chunk.toString();
    });
    stream.on("end", () => resolve(output));
    stream.on("error", reject);
    const rendered = renderToPipeableStream(
      <HelmetProvider>
        <StaticRouter location={url}>
          <App siteOrigin={siteOrigin} />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          rendered.pipe(stream);
        },
        onShellError: reject,
        onError(error) {
          console.error("Server render failed", error);
          reject(error);
        },
      },
    );
    const timer = setTimeout(() => {
      rendered.abort();
      reject(new Error("Server render timed out"));
    }, 10000);
    timer.unref();
    stream.on("end", () => clearTimeout(timer));
  });
}
