import { Hono } from "hono"
import { describeRoute } from "hono-typebox-openapi"
import { resolver } from "hono-typebox-openapi/typebox"
import { Type } from "typebox"

const HealthResponse = Type.Object({ status: Type.Literal("ok") })

const app = new Hono().get(
  "/",
  describeRoute({
    responses: {
      200: {
        description: "Service is healthy",
        content: {
          "application/json": {
            schema: resolver(HealthResponse),
          },
        },
      },
    },
  }),
  (c) => c.json({ status: "ok" as const }, 200),
)

export default app
