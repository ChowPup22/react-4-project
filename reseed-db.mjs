import { writeFileSync } from 'fs';
import { faker } from '@faker-js/faker';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (n) => Array.from(Array(n).keys());

const userAmount = 10;
const taskAmount = 20;
const meetingAmount = 10;
const meetingResponses = 10;
const userIds = range(userAmount).map((id) => id + 2);

const db = {
  users: [
    {
      firstName: "Admin",
      lastName: "Main",
      email: "admin@domain.com",
      password: "admin@1234",
      dateCreated: "2022-03-25T07:45:45.264Z",
      isAdmin: true,
      id: 0
    },
    {
      firstName: "User",
      lastName: "Main",
      email: "user@domain.com",
      password: "user@1234",
      dateCreated: "2022-06-08T02:23:30.510Z",
      isAdmin: false,
      id: 1
    },
    ...range(userAmount).map((id) => ({
      firstName: capitalize(faker.name.firstName()),
      lastName: capitalize(faker.name.lastName()),
      email: faker.internet.email(),
      password: faker.internet.password(),
      dateCreated: faker.date.recent(40),
      isAdmin: sample([true, false]),
      id: (id + 2),
    }))
  ],
  tasks: range(taskAmount).map((id) => ({
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    taskComplete: sample([true, false]),
    userId: sample(userIds),
    dateCreated: faker.date.recent(5),
    createdBy: sample(userIds),
    dateDueBy: faker.date.soon(10),
    id,
  })),
  meetings: range(meetingAmount).map((id) => ({
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    dateCreated: faker.date.recent(5),
    createdBy: sample(userIds),
    dateDueBy: faker.date.soon(15),
    meetingComplete: false,
    id,
  })),
  meetingResponses: range(meetingResponses).map((id) => ({
    meetingId: sample(range(meetingAmount)),
    userId: sample(userIds),
    response: sample(['accepted', 'rejected']),
    id,
  })),
  archivedMeetings: range(meetingAmount).map((id) => ({
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    dateCreated: faker.date.recent(20),
    createdBy: sample(userIds),
    dateDueBy: faker.date.recent(10),
    meetingComplete: true,
    archivedMeetingResponses: range(5).map((id) => ({
      meetingId: sample(range(meetingAmount)),
      userId: sample(userIds),
      response: 'accepted',
      id,
    })),
    id,
  }))
}

writeFileSync('db.json', JSON.stringify(db), { encoding: 'utf8' });