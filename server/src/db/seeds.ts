import { Database } from "sqlite";
import { getDatabase, initializeDatabase } from "./database";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const seedUser = async ({email, password, role}: {email: string, password: string, role: string}, {db}: {db: Database}): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await db.run(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    email,
    hashedPassword,
    role
  );

  return result.lastID
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await initializeDatabase();
    const db = await getDatabase();

    // Clear existing data
    await db.run('DELETE FROM survey_responses');
    await db.run('DELETE FROM surveys');
    await db.run('DELETE FROM users');
    console.log('🧹 Cleared existing data');

    // Create multiple users
    const usersData = [
      { email: 'admin@example.com', password: 'admin123', role: 'REVIEWER' },
      { email: 'reviewer@example.com', password: 'reviewer123', role: 'REVIEWER' },
      { email: 'user1@example.com', password: 'user123', role: 'RESPONDER' },
      { email: 'user2@example.com', password: 'user123', role: 'RESPONDER' },
      { email: 'user3@example.com', password: 'user123', role: 'RESPONDER' },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const result = await db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        userData.email,
        hashedPassword,
        userData.role
      );
      createdUsers.push({ ...userData, id: result.lastID });
      console.log(`✅ Created user: ${userData.email} (Role: ${userData.role})`);
    }

    // Create surveys
    const reviewerUser = createdUsers.find(u => u.role === 'REVIEWER');
    const surveysData = [
      {
        data: JSON.stringify({ someSurveyData: 5 }),
        created_by: reviewerUser?.id
      },
      {
        data: JSON.stringify({ someSurveyData: 6 }),
        created_by: reviewerUser?.id
      }
    ];

    const createdSurveys = [];
    for (const survey of surveysData) {
      const result = await db.run(
        'INSERT INTO surveys (data, created_by) VALUES (?, ?)',
        survey.data,
        survey.created_by
      );
      createdSurveys.push({ ...survey, id: result.lastID });
      console.log(`✅ Created survey`);
    }

    // Create survey responses from responders
    const responders = createdUsers.filter(u => u.role === 'RESPONDER');
    for (const responder of responders) {
      for (const survey of createdSurveys) {
        const responses = {
          satisfaction: Math.floor(Math.random() * 5) + 1,
          comments: `Sample feedback from ${responder.email}`,
          wouldRecommend: Math.random() > 0.5
        };

        await db.run(
          'INSERT INTO survey_responses (survey_id, user_id, responses, submitted_at) VALUES (?, ?, ?, ?)',
          survey.id,
          responder.id,
          JSON.stringify(responses),
          new Date()
        );
      }
    }
    console.log(`✅ Created ${responders.length * createdSurveys.length} survey responses`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nTest credentials:');
    usersData.forEach(u => {
      console.log(`  ${u.role.padEnd(10)}: ${u.email.padEnd(25)} / ${u.password}`);
    });

    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}