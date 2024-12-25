import { Post } from "@/types"

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const fetchPosts = async (search = ""):Promise<Post[]> => {
  let url = `${backendUrl}/posts`

  if (search) {
    url += `?search=${search}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    return []
  }

  return await response.json()
}

export const fetchActivities = async (search = ""):Promise<Activity[]> => {
  const url = `${backendUrl}/activities`
  const response = await fetch(url)

  if (!response.ok) {
    return []
  }

  return await response.json()
}