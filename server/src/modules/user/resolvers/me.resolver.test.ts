import { expect } from 'chai';
import { Database } from 'sqlite';
import { meResolver } from './me.resolver';

import { getDatabase, initializeDatabase } from '../../../db/database';
import { seedUser } from '../../../db/seeds';
import { Role } from '../../../graphql/gqlTypes';
import { MyContext } from '../../../create-server';

describe('[Resolver] Me', () => {
  let db: Database;
  let testUserId: number;
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123!';
  
  before(async () => {
    await initializeDatabase()
  })

  beforeEach(async () => {  
    db = await getDatabase("test_db")

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
    await db.close();
  })
  
  it('should return the current user when authenticated', async () => {
    const context: MyContext = {
      db,
      user: {
        id: testUserId,
        email: testEmail,
        role: Role.Reviewer
      }
    };
    
    const result = await (meResolver as any)(null, {}, context, {} as any);
    
    expect(result).to.be.an('object');
    expect(result.id).to.equal(testUserId.toString());
    expect(result.email).to.equal(testEmail);
    expect(result.role).to.equal(Role.Reviewer);
  });
  
  it('should throw an error when user is not authenticated', async () => {
    const context: MyContext = {
      db
    };
    
    // Act & Assert
    try {
      await (meResolver as any)(null, {}, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('User not authenticated');
      expect(error.extensions.code).to.equal('UNAUTHENTICATED');
    }
  });
  
  it('should throw an error when user does not exist in database', async () => {
    const nonExistentUserId = 999999;
    
    const context: MyContext = {
      db,
      user: {
        id: nonExistentUserId,
        email: 'nonexistent@example.com',
        role: Role.Reviewer
      }
    };
    
    // Act & Assert
    try {
      await (meResolver as any)(null, {}, context, {} as any);
      expect.fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).to.equal('User not found');
      expect(error.extensions.code).to.equal('NOT_FOUND');
    }
  });
});

