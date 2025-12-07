import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PostCreationState {
  content: string
  media: File[]
  error: string | null
  isPrivate: boolean
}

const initialState: PostCreationState = {
  content: '',
  media: [],
  error: null,
  isPrivate: false,
}

const postCreationSlice = createSlice({
  name: 'postCreation',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
      state.error = null
    },
    addMedia: (state, action: PayloadAction<File[]>) => {
      state.media = [...state.media, ...action.payload]
      state.error = null
    },
    removeMedia: (state, action: PayloadAction<number>) => {
      state.media = state.media.filter((_, index) => index !== action.payload)
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setPrivacy: (state, action: PayloadAction<boolean>) => {
      state.isPrivate = action.payload
    },
    resetPostCreation: (state) => {
      state.content = ''
      state.media = []
      state.error = null
      state.isPrivate = false
    },
  },
})

export const { setContent, addMedia, removeMedia, setError, setPrivacy, resetPostCreation } = postCreationSlice.actions
export default postCreationSlice.reducer