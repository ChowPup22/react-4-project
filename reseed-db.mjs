import { writeFileSync } from 'fs';
import { faker } from '@faker-js/faker';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (n) => Array.from(Array(n).keys());

const userAmount = 10;
const taskAmount = 20;
const meetingAmount = 10;
const userTaskIds = ["73b87c56-c33b-433c-b198-4f6fbfe05516", "6a0736d7-7c1d-4fce-baf9-9cdd9933c0e7", ...range(userAmount).map(() => faker.datatype.uuid())]

const db = {
  users: [
    {
      firstName: "Admin",
      lastName: "Main",
      email: "admin@domain.com",
      meta: {
        password: "admin@1234",
        userTaskId: "73b87c56-c33b-433c-b198-4f6fbfe05516",
        dateCreated: "2022-03-25T07:45:45.264Z",
        isAdmin: true
      },
      id: 0
    },
    {
      firstName: "User",
      lastName: "Main",
      email: "user@domain.com",
      meta: {
        password: "user@1234",
        userTaskId: "6a0736d7-7c1d-4fce-baf9-9cdd9933c0e7",
        dateCreated: "2022-06-08T02:23:30.510Z",
        isAdmin: false
      },
      id: 1
    },
    ...range(userAmount).map((id) => ({
      firstName: capitalize(faker.name.firstName()),
      lastName: capitalize(faker.name.lastName()),
      email: faker.internet.email(),
      meta: {
        password: faker.internet.password(),
        userTaskId: userTaskIds[id + 2],
        dateCreated: faker.date.past(),
        isAdmin: sample([true, false])
      },
      id: (id + 2),
    }))
  ],
  tasks: range(taskAmount).map((id) => ({
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    taskComplete: sample([true, false]),
    userTaskId: sample(userTaskIds),
    dateCreated: faker.date.past(),
    createdBy: sample(userTaskIds),
    dateDueBy: faker.date.future(),
    id,
  })),
  meetings: range(meetingAmount).map((id) => ({
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    userId1: sample(userTaskIds),
    userId2: sample(userTaskIds),
    dateCreated: faker.date.past(),
    createdBy: sample(userTaskIds),
    dateDueBy: faker.date.future(),
    meetingComplete: sample([true, false]),
    id,
  })),
}

writeFileSync('db.json', JSON.stringify(db), { encoding: 'utf8' });