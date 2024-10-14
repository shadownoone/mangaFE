export interface dataComics {
  comics: comics[]
  current_page: number
  total_pages: number
  status: number
}

export type comics = {
  id: string
  author: string | string[]
  followers: number
  genres: [
    {
      id: string
      name: string
    }
  ]

  manga_id: number
  is_trending: boolean
  slug: string

  chapters: {
    chapter_id: number
    manga_id: number
    name: string
    slug: string // Đảm bảo rằng mỗi chapter có slug
    title: string
    chapter_number: number
  }[]

  ratings: []
  other_names: string[]
  description: string
  status: string
  cover_image: string
  title: string
  total_comments: string
  views: number
  updatedAt: string
}

export type dataGenres = {
  genre_id: string
  name: string
  description: string
}

export type comicsDetail = {
  title: string
  thumbnail: string
  description: string
  authors: string
  status: string
  genres: [
    {
      id: string
      name: string
    }
  ]
  total_views: 403513975
  followers: 157303759
  chapters: [
    {
      id: number
      name: string
    }
  ]
  id: string
  other_names: Array<string>
}

export type comicsChapter = {
  manga_id: number
  name: string
  chapters: string
  slug: string
}[]

export type comicsComment = {
  comment_id: any
  avatar: string
  username: string
  chapter: {
    title: string
  }

  content: string
  stickers: [string]
  user_id: any
  user: {
    avatar: string
    username: string
    content: string
    stickers: [string]
    created_at: string
    vote_count: number
    mention_user: string
  }

  replies: [
    {
      avatar: string
      username: string
      content: string
      stickers: [string]
      created_at: string
      vote_count: number
      mention_user: string
    }
  ]

  createdAt: string
  vote_count: number

  total_comments: number
  total_pages: number
  current_page: number
}

export type comicSingleChapter = {
  chapter_id: string

  title: string
  images: [
    {
      image_id: number
      image_url: string
    }
  ]
  chapter: [
    {
      id: number
      name: string
    }
  ]
  chapter_name: string
  comic_name: string
  slug: string
}

export type comicSuggestSearch = [
  {
    id: string
    title: string
    thumbnail: string
    lastest_chapter: string
    genres: [string]
    authors: string
  }
]

export type favorite = {
  slug: string
  favoriteId: number
  mangaId: number
  mangaTitle: string
  coverImage: string
}

export type history = {
  historyId: number
  slug: string
  imageTitle: string
  chapterSlug: string
  chapterTitle: string
  mangaTitle: string
  last_read_at: string
}

export type user = {
  user_id: number
  avatar: string
}

export type Rating = {
  rating: number
}
