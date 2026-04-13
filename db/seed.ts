import { count } from 'drizzle-orm';
import { db } from './index';
import { applications, applicationStatusLogs, categories, targets, users } from './schema';

export async function seed() {
  const existingUsers = await db.select({count: count() }).from(users);
    if (existingUsers[0].count > 0) {
      console.log("Users already exist");
      return;
}

    const [user] = await db.insert(users).values({
        username: 'testuser',
        email: 'testuser@example.com',
        passwordHash: 'hashedpassword',
        createdAt: Math.floor(Date.now() / 1000),
    }).returning();

const categoryData = [
    { name: 'Tech', colour: '#007AFF', icon: 'laptop-code', userID: user.id },
    { name: 'Finance', colour: '#34C759', icon: 'chart-line', userID: user.id },
    { name: 'Healthcare', colour: '#FF9500', icon: 'heartbeat', userID: user.id },
    { name: 'Education', colour: '#AF52DE', icon: 'book-open', userID: user.id },
    { name: 'Retail', colour: '#FF3B30', icon: 'shopping-cart', userID: user.id },
];
const insertedCategories = await db.insert(categories).values(categoryData).returning();

const companies = [
    "Google", "Amazon", "Facebook", "Apple",
    "Microsoft", "Netflix", "Tesla", "IBM",
    "Intel", "Salesforce", "Oracle", "Adobe",
    "Uber", "Airbnb", "Spotify", "Twitter",
    "LinkedIn", "Snapchat", "Pinterest", "Dropbox"
];

const positions = [
    "Software Engineer", "Data Scientist", "Product Manager", "UX Designer",
    "Marketing Specialist", "Sales Representative", "Human Resources Manager", "Financial Analyst"
];

const statuses = ["applied", "interviewing", "offer", "rejected"];

const appValues = [];
const now = Math.floor(Date.now() / 1000);
for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const timestamp = now - (daysAgo * 86400);
    
    appValues.push({
        userID: user.id,
        categoryID: insertedCategories[Math.floor(Math.random() * insertedCategories.length)].id,
        companyName: companies[i],
        position : positions[Math.floor(Math.random() * positions.length)],
        createdAt: timestamp,
        appliedAt: timestamp,
        metric: 1,
        notes: i % 3 === 0 ? "Referred by a connection" : null,
    });
}

const insertedApplications = await db.insert(applications).values(appValues).returning();

const statusValues = { "applied": 0, "interviewing": 1, "offer": 2, "rejected": 3 };
const logValues = [];
for (const app of insertedApplications) {
    logValues.push({
        applicationID: app.id,
        oldStatus: -1,
        newStatus: 0,
        changedAt: app.createdAt,
    });
    
    const progressChance = Math.floor(Math.random() * 3);
    let currentTimestamp = app.appliedAt;

    for (let i = 0; i < progressChance; i++) {
        currentTimestamp += Math.floor(Math.random() * 15 * 86400) + 86400;
        const nextStatus = Math.min(i + 1, statuses.length - 1);
        logValues.push({
            applicationID: app.id,
            oldStatus: i,
            newStatus: nextStatus,
            changedAt: currentTimestamp,
        });
    }
}

await db.insert(applicationStatusLogs).values(logValues);

await db.insert(targets).values([
    { userID: user.id, period: 'weekly', goalValue: 5 },
    { userID: user.id, period: 'monthly', goalValue: 20 },
    { userID: user.id, period: 'quarterly', goalValue: 50 },
    ]);

    console.log("Seeding completed");
}
