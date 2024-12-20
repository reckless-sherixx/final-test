import { Post } from "@/types"

export const fetchPosts = async (search = ""):Promise<Post[]> => {
  let url = import.meta.env.VITE_BACKEND_URL + `/posts`
  if (search) {
    url += `?search=${search}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    return []
  }

  const posts = await response.json()

  return posts.map((post:any) => ({
    ...post,
    description: "test",
  }))

  // return posts
}