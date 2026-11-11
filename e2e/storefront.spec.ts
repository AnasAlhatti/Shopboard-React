import { expect, test } from '@playwright/test';

test('hydrates the homepage with Netlify head markup and restores its theme', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const charset = /(<meta[^>]+charset="utf-8"[^>]*>)/i;
    expect(html).toMatch(charset);
    await route.fulfill({
      response,
      body: html.replace(
        charset,
        '$1\n<!-- This site is hosted on Netlify. -->',
      ),
    });
  });

  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: /Vortex processors/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(
    page.getByRole('button', { name: 'Switch to dark theme' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Switch to dark theme' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('keeps a product in the cart after refresh and opens checkout', async ({
  page,
}) => {
  await page.goto('/products');
  await page
    .getByRole('link', { name: 'Aethel Vortex 9950X', exact: true })
    .click();
  await page.getByRole('button', { name: /Add to Cart/ }).click();
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Aethel Vortex 9950X' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Aethel Vortex 9950X' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  await expect(
    page.getByRole('heading', { name: 'Contact and delivery details' }),
  ).toBeVisible();
  await expect(page.getByLabel('Full name', { exact: true })).toBeVisible();
});
