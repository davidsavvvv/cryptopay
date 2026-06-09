import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type MerchantSettings = {
  id?: string
  username: string
  wallet_address: string
  business_name: string
  created_at?: string
}

export type Transaction = {
  id?: string
  merchant_username: string
  amount_eur: number
  amount_usdt: number
  fee_usdt: number
  status: 'completed' | 'pending' | 'failed'
  tx_hash?: string
  created_at?: string
}

export type PaymentPreviewRow = {
  id: string
  merchant_username: string
  name: string
  description: string
  config: Record<string, unknown>
  created_at?: string
}

export type PaymentLinkRow = {
  id: string
  merchant_username: string
  label: string
  slug: string
  type: 'libre' | 'fixe'
  amount?: number | null
  apercu_config?: Record<string, unknown> | null
  created_at?: string
}
