export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_steps: {
        Row: {
          campaign_id: string | null
          html: string | null
          id: string
          owner: string | null
          send_after: unknown | null
          step_number: number | null
          subject: string | null
        }
        Insert: {
          campaign_id?: string | null
          html?: string | null
          id?: string
          owner?: string | null
          send_after?: unknown | null
          step_number?: number | null
          subject?: string | null
        }
        Update: {
          campaign_id?: string | null
          html?: string | null
          id?: string
          owner?: string | null
          send_after?: unknown | null
          step_number?: number | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_steps_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          owner: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          owner?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          owner?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          campaign_id: string | null
          id: string
          lead_id: string | null
          owner: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"] | null
          step_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          id?: string
          lead_id?: string | null
          owner?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          step_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          id?: string
          lead_id?: string | null
          owner?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_log_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "campaign_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          bedrijf: string | null
          created_at: string
          email: string
          id: string
          image_path: string | null
          linkedin: string | null
          website: string | null
        }
        Insert: {
          bedrijf?: string | null
          created_at?: string
          email: string
          id?: string
          image_path?: string | null
          linkedin?: string | null
          website?: string | null
        }
        Update: {
          bedrijf?: string | null
          created_at?: string
          email?: string
          id?: string
          image_path?: string | null
          linkedin?: string | null
          website?: string | null
        }
        Relationships: []
      }
      senders: {
        Row: {
          daily_quota: number | null
          display_name: string | null
          email: string | null
          id: string
          owner: string | null
        }
        Insert: {
          daily_quota?: number | null
          display_name?: string | null
          email?: string | null
          id?: string
          owner?: string | null
        }
        Update: {
          daily_quota?: number | null
          display_name?: string | null
          email?: string | null
          id?: string
          owner?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string | null
          html: string | null
          id: string
          owner: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          html?: string | null
          id?: string
          owner?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          html?: string | null
          id?: string
          owner?: string | null
          subject?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      email_status: "pending" | "sent" | "bounced" | "opened" | "replied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      email_status: ["pending", "sent", "bounced", "opened", "replied"],
    },
  },
} as const
