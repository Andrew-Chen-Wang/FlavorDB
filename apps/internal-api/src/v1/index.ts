import { Hono } from "hono"
import { RegExpRouter } from "hono/router/reg-exp-router"
import health from "./health"

const app = new Hono({
  router: new RegExpRouter(),
})
  .basePath("/v1")
  .route("/health", health)

export default app
