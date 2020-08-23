const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().replace(/ /g, '_').toLowerCase();
    room = room.trim().replace(/ /g, '_').toLowerCase();

    existingUser = users.find(user => user.name === name && user.room === room);
    if (existingUser) {
        return {
            error: 'User with that name already exists in this room!',
        }
    }

    const user = { id, name, room };
    users.push(user);
    return {
        user,
        message: 'User added successfully'
    }
}

const removeUser = (id) => {
    const index = users.findIndex(u => u.id == id);
    let user = null;
    if (index > -1) {
        user = users.splice(index, 1)[0]
    }
    return {
        user,
        message: 'User removed successfuly'
    };
}

const getUser = (id) => {
    let user = users.find(u => u.id === id);
    return {
        user,
        message: 'User fetched successfully'
    }
}

const getUsersInRoom = (room) => {
    let usersInRoom = users.filter(u => u.room === room);
    return {
        users: usersInRoom,
        message: "Room users fetched successfully"
    }
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }