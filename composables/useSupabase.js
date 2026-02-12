import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const supabaseUrl = useRuntimeConfig().public.supabaseUrl
  const supabaseKey = useRuntimeConfig().public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('supabaseUrl or supabaseKey is missing')
  }

  return createClient(supabaseUrl, supabaseKey)
}
