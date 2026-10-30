import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "./contact.mjs";
const now = 1800000000000;
const valid = {
  name: "Alex Morgan",
  email: "alex@example.org",
  message: "I would like to discuss a healthcare analytics role.",
  website: "",
  startedAt: now - 6000,
};
test("valid contact message preserves the reply address and trims text", () =>
  assert.deepEqual(
    validateContact({ ...valid, name: " Alex Morgan " }, now).data,
    { name: "Alex Morgan", email: valid.email, message: valid.message },
  ));
test("honeypot identifies automated form submissions", () =>
  assert.equal(
    validateContact({ ...valid, website: "https://spam.invalid" }, now).spam,
    true,
  ));
test("rejects missing timestamps and impossible fast submissions", () => {
  assert.ok(validateContact({ ...valid, startedAt: undefined }, now).error);
  assert.ok(validateContact({ ...valid, startedAt: now - 20 }, now).error);
});
test("rejects malformed email and header injection", () => {
  assert.ok(validateContact({ ...valid, email: "invalid" }, now).error);
  assert.ok(
    validateContact(
      { ...valid, email: "alex@example.org\r\nBcc:other@example.org" },
      now,
    ).error,
  );
});
test("enforces message and name boundaries", () => {
  assert.ok(validateContact({ ...valid, message: "short" }, now).error);
  assert.ok(
    validateContact({ ...valid, message: "a".repeat(5001) }, now).error,
  );
  assert.ok(validateContact({ ...valid, name: "A" }, now).error);
});
