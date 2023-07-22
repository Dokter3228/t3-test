import { type User } from "@clerk/backend";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    fullName: `${user.firstName} ${user.lastName}` || null,
    profileImageUrl: user.imageUrl || user.profileImageUrl,
  };
};
