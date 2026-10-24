import assert from "node:assert/strict";
import test from "node:test";

test("configured browser hosts can load Next dev resources", async () => {
  const previousAllowed = process.env.PI_WEB_ALLOWED_HOSTS;
  const previousHostname = process.env.PI_WEB_HOSTNAME;
  process.env.PI_WEB_ALLOWED_HOSTS = " demo.example.test , 100.100.100.100 , ";
  process.env.PI_WEB_HOSTNAME = "primary.example.test";

  try {
    const { default: config } = await import("../next.config.ts?allowed-dev-origins-test");
    for (const host of ["demo.example.test", "100.100.100.100", "primary.example.test"]) {
      assert.ok(config.allowedDevOrigins?.includes(host), `${host} must be a dev origin`);
    }
    assert.ok(!config.allowedDevOrigins?.includes(""), "empty configured hosts must be ignored");
  } finally {
    if (previousAllowed === undefined) delete process.env.PI_WEB_ALLOWED_HOSTS;
    else process.env.PI_WEB_ALLOWED_HOSTS = previousAllowed;
    if (previousHostname === undefined) delete process.env.PI_WEB_HOSTNAME;
    else process.env.PI_WEB_HOSTNAME = previousHostname;
  }
});
