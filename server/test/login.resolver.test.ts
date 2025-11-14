import { expect } from 'chai';
import { Database } from 'sqlite';
import { loginResolver } from '../src/modules/user/resolvers/login.resolver';
import { MyContext } from '../src/index';
import { getDatabase, initializeDatabase } from '../src/db/database';
import { seedUser } from '../src/db/seeds';
import { Role } from '../src/graphql/gqlTypes';

describe('Login Resolver Integration Test', () => {
  let db: Database;
  let testUserId: number;
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123!';
  
  before(async () => {
    db = await getDatabase("test_db")
    await initializeDatabase()
  })

  beforeEach(async () => {  
    const id = await seedUser({email: testEmail, password: testPassword, role: Role.Reviewer}, {db})

    testUserId = id
  });
  
  afterEach(async () => {
    if (!testUserId) {
      return
    }

    await db.run('DELETE FROM users WHERE id = ?', testUserId);
  });

  after(async () => {
    // Close database connection
    await db.close();
  })
  
  it('should return a token string when login is successful', async () => {
    const context: MyContext = {
      db
    };
    
    const args = {
      email: testEmail,
      password: testPassword
    };
    
    const result = await (loginResolver as any)(null, args, context, {} as any);
    
    expect(result).to.be.a('string');
    expect(result).to.equal('generated-token-here');
  });
  
  it('should throw an error when email is missing', async () => {
    const context: MyContext = {
      db
    };
    
    const args = {
      email: '',
      password: testPassword
    };
    
    // Act & Assert
    try {
      await (loginResolver as any)(null, args, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('Email and password are required');
      expect(error.extensions.code).to.equal('BAD_USER_INPUT');
    }
  });
  
  it('should throw an error when password is missing', async () => {
    // Arrange
    const context: MyContext = {
      db
    };
    
    const args = {
      email: testEmail,
      password: ''
    };
    
    // Act & Assert
    try {
      await (loginResolver as any)(null, args, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('Email and password are required');
      expect(error.extensions.code).to.equal('BAD_USER_INPUT');
    }
  });
  
  it('should throw an error when user does not exist', async () => {
    // Arrange
    const context: MyContext = {
      db
    };
    
    const args = {
      email: 'nonexistent@example.com',
      password: testPassword
    };
    
    // Act & Assert
    try {
      await (loginResolver as any)(null, args, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('User not found');
      expect(error.extensions.code).to.equal('NOT_FOUND');
    }
  });
  
  it('should throw an error when password is incorrect', async () => {
    // Arrange
    const context: MyContext = {
      db
    };
    
    const args = {
      email: testEmail,
      password: 'WrongPassword123!'
    };
    
    // Act & Assert
    try {
      await (loginResolver as any)(null, args, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('Invalid password');
      expect(error.extensions.code).to.equal('UNAUTHENTICATED');
    }
  });
});

