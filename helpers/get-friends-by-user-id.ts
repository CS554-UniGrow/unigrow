import { fetchRedis } from "./redis"

export const getFriendsByUserId = async (userId: string) => {
  // retrieve friends for current user

  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[]

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = await fetchRedis("get", `user:${friendId}`)
      const parsedFriend = JSON.parse(friend) as any
      return parsedFriend
    })
  )

  return friends
}
