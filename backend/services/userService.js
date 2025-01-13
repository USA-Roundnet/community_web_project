let users = [
  { id: 1, name: 'Izayah Gibson', email: 'izayahgibson@example.com' },
  { id: 2, name: 'Isaac Miller', email: 'isaacmiller@example.com' },
];

const getAllUsers = async () => {
  return users;
};

const getUserById = async (id) => {
  return users.find((user) => user.id === parseInt(id));
};

const createUser = async (userData) => {
  const newUser = { id: users.length + 1, ...userData };
  users.push(newUser);
  return newUser;
};

const updateUser = async (id, userData) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    return null;
  }
  users[userIndex] = { ...users[userIndex], ...userData };
  return users[userIndex];
};

const deleteUser = async (id) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    return false;
  }
  users.splice(userIndex, 1);
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
