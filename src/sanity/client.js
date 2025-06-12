// src/sanity/client.js
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'qit3q9qo',
  dataset: 'dev',
  apiVersion: '2025-06-12',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN
})
