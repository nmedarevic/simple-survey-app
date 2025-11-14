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


    const surveysData = [
      {
        data:'{"pages":[{"elements":[{"name":"first-name","title":"Enter your first name:","type":"text","validators":[{"type":"expression","text":"Your name must be at least one character long","expression":"validateStringLength({first-name}, 1)"}]},{"name":"last-name","title":"Enter your last name:","type":"text","validators":[{"type":"expression","text":"Your last name must be at least one character long","expression":"validateStringLength({last-name}, 1)"}]},{"type":"paneldynamic","name":"vacation-info","title":"Enter information about your vacations","panelCount":1,"maxPanelCount":10,"confirmDelete":true,"templateElements":[{"type":"dropdown","name":"country","title":"Select a country","choicesByUrl":{"url":"https://surveyjs.io/api/CountriesExample","valueName":"name"}},{"type":"text","name":"start-date","title":"Select a vacation start date","defaultValueExpression":"today()","inputType":"date","visibleIf":"{panel.country} notempty"},{"type":"text","name":"end-date","startWithNewLine":false,"title":"Select a vacation end date","defaultValueExpression":"today(10)","validators":[{"type":"expression","text":"End date should be greater than start date","expression":"{panel.start-date} < {panel.end-date}"}],"inputType":"date","visibleIf":"{panel.country} notempty"},{"type":"html","name":"days-spent","readOnly":true,"html":"<b>Days spent in {panel.country}</b>: {panel.diffdays}","titleLocation":"left","visibleIf":"{panel.country} notempty and {panel.start-date} notempty and {panel.end-date} notempty and {panel.start-date} < {panel.end-date}"},{"type":"expression","name":"diffdays","expression":"iif({panel.start-date} < {panel.end-date}, diffDays({panel.start-date}, {panel.end-date}), 0)","visible":false}]}]},{"elements":[{"name":"satisfaction","title":"Are you going to enjoy your vacation","type":"radiogroup","choices":[{"value":false,"text":"No"},{"value":true,"text":"Yes!"}],"isRequired":true}]}],"pageNextText":"Forward","completeText":"Submit","showPrevButton":false,"firstPageIsStartPage":true,"startSurveyText":"Take the Survey","completedHtml":"Thank you for your feedback!","showPreviewBeforeComplete":"showAnsweredQuestions"}'
      }
    ];

    const createdSurveys = [];
    for (const survey of surveysData) {
      const result = await db.run(
        'INSERT INTO surveys (data, created_by) VALUES (?, ?)',
        survey.data,
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