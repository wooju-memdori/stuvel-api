const users = [];

const addUser = ({ id, name, room }) => {
  const existingUser = users.find(
    user => user.room === room && user.name === name,
  );

  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

module.exports = { addUser, getUser, getUsersInRoom };
