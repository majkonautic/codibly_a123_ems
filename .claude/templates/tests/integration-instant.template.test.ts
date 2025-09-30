/**
 * INSTANT Track Integration Tests - API endpoint verification
 * 3 essential integration tests for core workflows
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

describe('{module_name} - Core Integration Tests', () => {
  let app;
  let testUser;

  beforeAll(async () => {
    // Setup test environment
    app = await setupTestApp();
    testUser = await createTestUser();
  });

  afterAll(async () => {
    // Cleanup
    await cleanupTestData();
  });

  it('01 - POST /api/{resource} - should create new {resource}', async () => {
    const response = await request(app)
      .post('/api/{resource}')
      .send({
        {field1}: 'test_value',
        {field2}: 123,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.{field1}).toBe('test_value');
  });

  it('02 - GET /api/{resource} - should retrieve {resource} list', async () => {
    const response = await request(app)
      .get('/api/{resource}')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('03 - Full user workflow - should complete end-to-end', async () => {
    // Step 1: Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123',
      })
      .expect(200);

    const token = loginResponse.body.token;

    // Step 2: Create resource
    const createResponse = await request(app)
      .post('/api/{resource}')
      .set('Authorization', `Bearer ${token}`)
      .send({
        {field1}: 'workflow_test',
      })
      .expect(201);

    const resourceId = createResponse.body.id;

    // Step 3: Verify creation
    const getResponse = await request(app)
      .get(`/api/{resource}/${resourceId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getResponse.body.{field1}).toBe('workflow_test');
  });
});