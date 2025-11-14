import request from 'supertest';
import { createServer } from '../src/create-server';
import { expect } from 'chai';

const queryData = {
  query: `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }`,
  variables: { email: "user1@example.com", password: 'user123' },
};

const allSubmissionsQuery = {
  query: `
    query AllSubmissions {
      allSubmissions {
        data
        id
        submittedAt
        userId
      }
    }
  `
}

describe('E2E tests', () => {
  let server, url;

  before(async () => {  
    ({ server, url } = await createServer({ port: 3300 }));
  });


  after(async () => {
    await server?.stop();
  });

  it('can log in with seeded users', async () => {
    const response = await request(url).post('/').send(queryData);
    
    expect(response.errors).to.be.undefined;
    expect(response.body.data.login).not.to.be.undefined;
  });

  it('should not allow responder user to access reviewer area', async () => {
    const response = await request(url).post('/').send(queryData);
    
    expect(response.errors).to.be.undefined;
    expect(response.body.data.login).not.to.be.undefined;
    
    const response2 = await request(url).post('/').set('Authorization', `Bearer ${response.body.data.login}`).send(allSubmissionsQuery);

    expect(Array.isArray(response2.body.errors)).to.be.true
    expect(response2.body.errors[0].message).to.be.equal("Access denied. Required role: REVIEWER")
  });
});