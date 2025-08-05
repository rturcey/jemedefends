// Types partagés entre backend et frontend
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface FormData {
  buyer_info: BuyerInfo
  seller_info: SellerInfo
  product_info: ProductInfo
  problem_info: ProblemInfo
}

export interface BuyerInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

export interface SellerInfo {
  company_name: string
  address: string
  email?: string
}

export interface ProductInfo {
  name: string
  purchase_date: string
  purchase_price: number
}

export interface ProblemInfo {
  description: string
  problem_date: string
}
