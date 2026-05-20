import { expect, test } from "@playwright/test";

const createAppFromDto = (dto, overrides = {}) => ({
  id: overrides.id ?? "app-1",
  userId: "user-1",
  companyName: dto.CompanyName,
  position: dto.Position,
  applicationLink: dto.ApplicationLink,
  status: dto.Status,
  description: dto.Description,
  dateApplied: dto.DateApplied,
  dateCreated: overrides.dateCreated ?? "2026-05-20T10:00:00Z",
  dateUpdated: overrides.dateUpdated ?? "2026-05-20T10:00:00Z",
});

test("login, create, edit, navigate to recent application, and delete", async ({
  page,
}) => {
  let applications = [];

  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "playwright-token" }),
    });
  });

  await page.route("**/api/jobapplication", async (route) => {
    const request = route.request();
    const method = request.method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ jobApplications: applications }),
      });
      return;
    }

    if (method === "POST") {
      const dto = request.postDataJSON();
      const created = createAppFromDto(dto);
      applications = [created, ...applications];
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ jobApplication: created }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route("**/api/jobapplication/*", async (route) => {
    const request = route.request();
    const method = request.method();
    const id = request.url().split("/").pop();

    if (method === "PUT") {
      const dto = request.postDataJSON();
      applications = applications.map((application) =>
        application.id === id
          ? createAppFromDto(dto, {
              id,
              dateCreated: application.dateCreated,
              dateUpdated: "2026-05-20T11:00:00Z",
            })
          : application,
      );
      await route.fulfill({ status: 204 });
      return;
    }

    if (method === "DELETE") {
      applications = applications.filter((application) => application.id !== id);
      await route.fulfill({ status: 204 });
      return;
    }

    await route.fallback();
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("user@example.com");
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole("button", { name: /add application/i }).click();
  await page.getByLabel(/company name/i).fill("OpenAI");
  await page.getByLabel(/position/i).fill("Frontend Engineer");
  await page
    .getByLabel(/application link/i)
    .fill("https://openai.com/careers");
  await page
    .getByLabel(/notes/i)
    .fill("Applied through the careers page.");
  await page
    .getByRole("button", { name: /add application/i })
    .last()
    .click();

  await expect(page.getByText("Frontend Engineer")).toBeVisible();

  await page.getByRole("link", { name: /frontend engineer/i }).click();
  await expect(page).toHaveURL(/\/applications\?applicationId=app-1/);
  await expect(page.locator("#application-app-1")).toContainText("OpenAI");

  await page.locator("#application-app-1").hover();
  await page.getByTitle("Edit").click();
  await page.getByLabel(/position/i).fill("Senior Frontend Engineer");
  await page.getByRole("button", { name: /save changes/i }).click();

  await expect(page.getByText("Senior Frontend Engineer")).toBeVisible();

  await page.locator("#application-app-1").hover();
  await page.getByTitle("Delete").click();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(page.getByText("No applications yet")).toBeVisible();
});
