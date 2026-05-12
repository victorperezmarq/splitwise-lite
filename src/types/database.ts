export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "14.5"
    }
    public: {
        Tables: {
            debt_payments: {
                Row: {
                    amount: number
                    from_user: string
                    id: string
                    paid_at: string
                    split_id: string
                    to_user: string
                }
                Insert: {
                    amount: number
                    from_user: string
                    id?: string
                    paid_at?: string
                    split_id: string
                    to_user: string
                }
                Update: {
                    amount?: number
                    from_user?: string
                    id?: string
                    paid_at?: string
                    split_id?: string
                    to_user?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "debt_payments_from_user_fkey"
                        columns: ["from_user"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "debt_payments_split_id_fkey"
                        columns: ["split_id"]
                        isOneToOne: false
                        referencedRelation: "expense_splits"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "debt_payments_to_user_fkey"
                        columns: ["to_user"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            expense_splits: {
                Row: {
                    amount: number
                    expense_id: string
                    id: string
                    is_settled: boolean
                    settled_at: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    expense_id: string
                    id?: string
                    is_settled?: boolean
                    settled_at?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    expense_id?: string
                    id?: string
                    is_settled?: boolean
                    settled_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "expense_splits_expense_id_fkey"
                        columns: ["expense_id"]
                        isOneToOne: false
                        referencedRelation: "expenses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "expense_splits_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            expenses: {
                Row: {
                    amount: number
                    category: string
                    created_at: string
                    group_id: string
                    id: string
                    paid_by: string
                    receipt_url: string | null
                    title: string
                }
                Insert: {
                    amount: number
                    category?: string
                    created_at?: string
                    group_id: string
                    id?: string
                    paid_by: string
                    receipt_url?: string | null
                    title: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string
                    group_id?: string
                    id?: string
                    paid_by?: string
                    receipt_url?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "expenses_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "expenses_paid_by_fkey"
                        columns: ["paid_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            group_members: {
                Row: {
                    group_id: string
                    id: string
                    joined_at: string
                    role: string
                    user_id: string
                }
                Insert: {
                    group_id: string
                    id?: string
                    joined_at?: string
                    role?: string
                    user_id: string
                }
                Update: {
                    group_id?: string
                    id?: string
                    joined_at?: string
                    role?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "group_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            groups: {
                Row: {
                    created_at: string
                    created_by: string
                    description: string | null
                    id: string
                    invite_code: string
                    name: string
                }
                Insert: {
                    created_at?: string
                    created_by: string
                    description?: string | null
                    id?: string
                    invite_code?: string
                    name: string
                }
                Update: {
                    created_at?: string
                    created_by?: string
                    description?: string | null
                    id?: string
                    invite_code?: string
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "groups_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    full_name: string
                    id: string
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name: string
                    id: string
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name?: string
                    id?: string
                }
                Relationships: []
            }
        }
        Views: {
            group_balances: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    group_id: string | null
                    net_balance: number | null
                    total_owes: number | null
                    total_paid: number | null
                    user_id: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "group_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Functions: {
            create_expense_with_splits: {
                Args: {
                    p_amount: number
                    p_category: string
                    p_group_id: string
                    p_paid_by: string
                    p_receipt_url: string
                    p_split_user_ids: string[]
                    p_title: string
                }
                Returns: {
                    amount: number
                    category: string
                    created_at: string
                    group_id: string
                    id: string
                    paid_by: string
                    receipt_url: string | null
                    title: string
                }
            }
            settle_split: {
                Args: { p_from_user: string; p_split_id: string }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
    }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
    ? U
    : never
    : never

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de conveniencia — usa estos directamente en tus componentes y actions
// ─────────────────────────────────────────────────────────────────────────────

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseSplit = Database['public']['Tables']['expense_splits']['Row']
export type DebtPayment = Database['public']['Tables']['debt_payments']['Row']
export type GroupBalance = Database['public']['Views']['group_balances']['Row']

// Tipos compuestos con JOINs — resultado de queries con relaciones anidadas
export type GroupWithMembers = Group & {
    group_members: (GroupMember & {
        profiles: Profile
    })[]
}

export type ExpenseWithSplits = Expense & {
    profiles: Profile  // quien pagó
    expense_splits: (ExpenseSplit & {
        profiles: Profile // quien debe
    })[]
}

// Añadir a src/types/database.ts

export type NotificationType =
    | 'expense_added'
    | 'debt_settled'
    | 'group_joined'
    | 'debt_reminder'

export type Notification = {
    id: string
    user_id: string
    type: NotificationType
    title: string
    body: string
    group_id: string | null
    is_read: boolean
    created_at: string
}