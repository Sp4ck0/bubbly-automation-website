import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SPEC_URL = `${import.meta.env.VITE_CONVEX_URL?.replace(".convex.cloud", ".convex.site")}/openapi.json`;

export default function ApiDocsPage() {
  return (
    <SwaggerUI
      url={SPEC_URL}
      persistAuthorization={true}
      requestInterceptor={(req) => {
        // swagger-ui sends auth as a header — pass through unchanged
        return req;
      }}
    />
  );
}
