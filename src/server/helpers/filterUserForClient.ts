import { type User } from "@clerk/backend";

export const filterUserForClient = (user: User) => {
  console.log(user);
  return {
    id: user.id,
    username: user.username,
    fullName: `${user.firstName} ${user.lastName}` || null,
    profileImageUrl: user.profileImageUrl,
  };
};
