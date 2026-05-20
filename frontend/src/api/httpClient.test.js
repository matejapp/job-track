import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest, AUTH_UNAUTHORIZED_EVENT } from "./httpClient";

describe("apiRequest", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("attaches the stored JWT to authenticated requests", async () => {
    localStorage.setItem("token", "abc123");
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await apiRequest("/jobapplication");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/jobapplication"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc123",
        }),
      }),
    );
  });

  it("clears token and emits unauthorized event on protected 401", async () => {
    localStorage.setItem("token", "expired-token");
    const listener = vi.fn();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: "Unauthorized" } }), {
        status: 401,
      }),
    );

    await expect(apiRequest("/jobapplication")).rejects.toMatchObject({
      status: 401,
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
  });
});
