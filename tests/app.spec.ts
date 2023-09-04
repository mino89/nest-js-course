import {test, expect} from '@playwright/test';
const BASE_USER = {
  "email": "emailxxx@test.it",
  "password": "1234"
}


test.beforeAll(async ({request}) => {
  const response = await request.post('/auth/signin', {data: BASE_USER})
  expect(response.status()).toBe(201)
})

test('must return a list of vehichles', async ({page, request}) => {
  const response = await request.get('/reports')
  expect(response.status()).toBe(200)
})

