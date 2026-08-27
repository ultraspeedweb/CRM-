export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          assigned_to: string | null
          cancellation_reason: string | null
          conversation_id: string | null
          created_at: string
          created_by: string | null
          ends_at: string
          id: string
          lead_id: string
          location: string | null
          meeting_url: string | null
          notes: string | null
          organization_id: string
          starts_at: string
          status: string
          timezone: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          cancellation_reason?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          ends_at: string
          id?: string
          lead_id: string
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          organization_id: string
          starts_at: string
          status?: string
          timezone?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          cancellation_reason?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string
          id?: string
          lead_id?: string
          location?: string | null
          meeting_url?: string | null
          notes?: string | null
          organization_id?: string
          starts_at?: string
          status?: string
          timezone?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organization_id_assigned_to_fkey"
            columns: ["organization_id", "assigned_to"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "appointments_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "appointments_organization_id_created_by_fkey"
            columns: ["organization_id", "created_by"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "appointments_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          entity_id: string | null
          entity_type: string | null
          id: number
          metadata: Json
          occurred_at: string
          organization_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          metadata?: Json
          occurred_at?: string
          organization_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          metadata?: Json
          occurred_at?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          last_run_at: string | null
          name: string
          organization_id: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name: string
          organization_id: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name?: string
          organization_id?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_organization_id_created_by_fkey"
            columns: ["organization_id", "created_by"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "automation_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          finished_at: string | null
          id: string
          idempotency_key: string | null
          input: Json
          organization_id: string
          output: Json
          rule_id: string | null
          started_at: string | null
          status: string
          trigger_type: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          organization_id: string
          output?: Json
          rule_id?: string | null
          started_at?: string | null
          status?: string
          trigger_type: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          organization_id?: string
          output?: Json
          rule_id?: string | null
          started_at?: string | null
          status?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_organization_id_rule_id_fkey"
            columns: ["organization_id", "rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      branches: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          timezone: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_language: string | null
          assigned_to: string | null
          channel: string
          closed_at: string | null
          created_at: string
          customer_language: string | null
          external_thread_id: string | null
          handling_mode: string
          handoff_at: string | null
          handoff_by: string | null
          handoff_reason: string | null
          id: string
          last_message_at: string | null
          lead_id: string | null
          organization_id: string
          status: string
          summary: string | null
          unread_count: number
          updated_at: string
        }
        Insert: {
          agent_language?: string | null
          assigned_to?: string | null
          channel: string
          closed_at?: string | null
          created_at?: string
          customer_language?: string | null
          external_thread_id?: string | null
          handling_mode?: string
          handoff_at?: string | null
          handoff_by?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          organization_id: string
          status?: string
          summary?: string | null
          unread_count?: number
          updated_at?: string
        }
        Update: {
          agent_language?: string | null
          assigned_to?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string
          customer_language?: string | null
          external_thread_id?: string | null
          handling_mode?: string
          handoff_at?: string | null
          handoff_by?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          organization_id?: string
          status?: string
          summary?: string | null
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_organization_id_assigned_to_fkey"
            columns: ["organization_id", "assigned_to"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          closed_at: string | null
          created_at: string
          currency: string
          expected_close_date: string | null
          id: string
          lead_id: string
          lost_reason: string | null
          metadata: Json
          organization_id: string
          owner_user_id: string | null
          probability: number
          stage: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          closed_at?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          lead_id: string
          lost_reason?: string | null
          metadata?: Json
          organization_id: string
          owner_user_id?: string | null
          probability?: number
          stage?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          closed_at?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          lead_id?: string
          lost_reason?: string | null
          metadata?: Json
          organization_id?: string
          owner_user_id?: string | null
          probability?: number
          stage?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "deals_organization_id_owner_user_id_fkey"
            columns: ["organization_id", "owner_user_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          assigned_to: string | null
          attempt_count: number
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          created_by: string | null
          due_at: string
          follow_up_type: string
          id: string
          instructions: string | null
          lead_id: string
          organization_id: string
          payload: Json
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attempt_count?: number
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          due_at: string
          follow_up_type?: string
          id?: string
          instructions?: string | null
          lead_id: string
          organization_id: string
          payload?: Json
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attempt_count?: number
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by?: string | null
          due_at?: string
          follow_up_type?: string
          id?: string
          instructions?: string | null
          lead_id?: string
          organization_id?: string
          payload?: Json
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_organization_id_assigned_to_fkey"
            columns: ["organization_id", "assigned_to"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "follow_ups_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "follow_ups_organization_id_created_by_fkey"
            columns: ["organization_id", "created_by"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "follow_ups_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      lead_events: {
        Row: {
          actor_user_id: string | null
          event_type: string
          from_value: string | null
          id: number
          lead_id: string
          metadata: Json
          occurred_at: string
          organization_id: string
          to_value: string | null
        }
        Insert: {
          actor_user_id?: string | null
          event_type: string
          from_value?: string | null
          id?: never
          lead_id: string
          metadata?: Json
          occurred_at?: string
          organization_id: string
          to_value?: string | null
        }
        Update: {
          actor_user_id?: string | null
          event_type?: string
          from_value?: string | null
          id?: never
          lead_id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_organization_id_actor_user_id_fkey"
            columns: ["organization_id", "actor_user_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "lead_events_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      lead_qualifications: {
        Row: {
          answers: Json
          budget_fit: string | null
          confidence: number | null
          created_at: string
          created_by: string | null
          decision_role: string | null
          id: string
          lead_id: string
          missing_fields: string[]
          need_summary: string | null
          organization_id: string
          preferred_area: string | null
          property_type: string | null
          purpose: string | null
          qualified_by: string
          timeline: string | null
          version: number
        }
        Insert: {
          answers?: Json
          budget_fit?: string | null
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          decision_role?: string | null
          id?: string
          lead_id: string
          missing_fields?: string[]
          need_summary?: string | null
          organization_id: string
          preferred_area?: string | null
          property_type?: string | null
          purpose?: string | null
          qualified_by?: string
          timeline?: string | null
          version?: number
        }
        Update: {
          answers?: Json
          budget_fit?: string | null
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          decision_role?: string | null
          id?: string
          lead_id?: string
          missing_fields?: string[]
          need_summary?: string | null
          organization_id?: string
          preferred_area?: string | null
          property_type?: string | null
          purpose?: string | null
          qualified_by?: string
          timeline?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_qualifications_organization_id_created_by_fkey"
            columns: ["organization_id", "created_by"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "lead_qualifications_organization_id_lead_id_fkey"
            columns: ["organization_id", "lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          channel: string
          configuration: Json
          created_at: string
          external_account_id: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          channel: string
          configuration?: Json
          created_at?: string
          external_account_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          channel?: string
          configuration?: Json
          created_at?: string
          external_account_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ad_name: string | null
          assigned_to: string | null
          attribution: Json
          branch_id: string | null
          budget_max: number | null
          budget_min: number | null
          campaign_name: string | null
          city: string | null
          consent_at: string | null
          consent_status: string
          country: string | null
          created_at: string
          created_by: string | null
          currency: string
          detected_language: string | null
          email: string | null
          external_ref: string | null
          full_name: string
          id: string
          intent: string | null
          last_contact_at: string | null
          lost_reason: string | null
          organization_id: string
          phone: string | null
          preferred_language: string
          priority: string
          qualified_at: string | null
          score: number
          source_channel: string | null
          source_id: string | null
          status: string
          timeline: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp_phone: string | null
          won_at: string | null
        }
        Insert: {
          ad_name?: string | null
          assigned_to?: string | null
          attribution?: Json
          branch_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          campaign_name?: string | null
          city?: string | null
          consent_at?: string | null
          consent_status?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          detected_language?: string | null
          email?: string | null
          external_ref?: string | null
          full_name: string
          id?: string
          intent?: string | null
          last_contact_at?: string | null
          lost_reason?: string | null
          organization_id: string
          phone?: string | null
          preferred_language?: string
          priority?: string
          qualified_at?: string | null
          score?: number
          source_channel?: string | null
          source_id?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_phone?: string | null
          won_at?: string | null
        }
        Update: {
          ad_name?: string | null
          assigned_to?: string | null
          attribution?: Json
          branch_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          campaign_name?: string | null
          city?: string | null
          consent_at?: string | null
          consent_status?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          detected_language?: string | null
          email?: string | null
          external_ref?: string | null
          full_name?: string
          id?: string
          intent?: string | null
          last_contact_at?: string | null
          lost_reason?: string | null
          organization_id?: string
          phone?: string | null
          preferred_language?: string
          priority?: string
          qualified_at?: string | null
          score?: number
          source_channel?: string | null
          source_id?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp_phone?: string | null
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_fk"
            columns: ["organization_id", "assigned_to"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "leads_branch_fk"
            columns: ["organization_id", "branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "leads_created_by_fk"
            columns: ["organization_id", "created_by"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_source_fk"
            columns: ["organization_id", "source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string
          delivered_at: string | null
          delivery_status: string
          direction: string
          external_message_id: string | null
          failure_reason: string | null
          id: string
          media_url: string | null
          message_type: string
          organization_id: string
          original_language: string | null
          original_text: string | null
          protected_entities: Json
          raw_payload: Json
          read_at: string | null
          sender_type: string
          sender_user_id: string | null
          sent_at: string | null
          translated_language: string | null
          translated_text: string | null
          translation_confidence: number | null
          translation_provider: string | null
          translation_review_required: boolean
          translation_reviewed_at: string | null
          translation_reviewed_by: string | null
          translation_status: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string
          direction: string
          external_message_id?: string | null
          failure_reason?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          organization_id: string
          original_language?: string | null
          original_text?: string | null
          protected_entities?: Json
          raw_payload?: Json
          read_at?: string | null
          sender_type: string
          sender_user_id?: string | null
          sent_at?: string | null
          translated_language?: string | null
          translated_text?: string | null
          translation_confidence?: number | null
          translation_provider?: string | null
          translation_review_required?: boolean
          translation_reviewed_at?: string | null
          translation_reviewed_by?: string | null
          translation_status?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string
          direction?: string
          external_message_id?: string | null
          failure_reason?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          organization_id?: string
          original_language?: string | null
          original_text?: string | null
          protected_entities?: Json
          raw_payload?: Json
          read_at?: string | null
          sender_type?: string
          sender_user_id?: string | null
          sent_at?: string | null
          translated_language?: string | null
          translated_text?: string | null
          translation_confidence?: number | null
          translation_provider?: string | null
          translation_review_required?: boolean
          translation_reviewed_at?: string | null
          translation_reviewed_by?: string | null
          translation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "messages_organization_id_sender_user_id_fkey"
            columns: ["organization_id", "sender_user_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          notification_type: string
          organization_id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          notification_type: string
          organization_id: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          notification_type?: string
          organization_id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_user_id_fkey"
            columns: ["organization_id", "user_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "user_id"]
          },
        ]
      }
      organization_bootstrap_requests: {
        Row: {
          created_at: string
          created_organization_id: string | null
          locale: string
          member_full_name: string
          organization_name: string
          organization_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_organization_id?: string | null
          locale?: string
          member_full_name: string
          organization_name: string
          organization_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_organization_id?: string | null
          locale?: string
          member_full_name?: string
          organization_name?: string
          organization_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_bootstrap_requests_created_organization_id_fkey"
            columns: ["created_organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          job_title: string | null
          organization_id: string
          preferred_locale: string | null
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          job_title?: string | null
          organization_id: string
          preferred_locale?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          job_title?: string | null
          organization_id?: string
          preferred_locale?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          default_locale: string
          id: string
          name: string
          slug: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_locale?: string
          id?: string
          name: string
          slug: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_locale?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_connections: {
        Row: {
          access_token_env_key: string | null
          created_at: string
          created_by: string | null
          display_name: string | null
          display_phone_number: string | null
          id: string
          metadata: Json
          organization_id: string
          phone_number_id: string
          status: string
          updated_at: string
          whatsapp_business_account_id: string | null
        }
        Insert: {
          access_token_env_key?: string | null
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          display_phone_number?: string | null
          id?: string
          metadata?: Json
          organization_id: string
          phone_number_id: string
          status?: string
          updated_at?: string
          whatsapp_business_account_id?: string | null
        }
        Update: {
          access_token_env_key?: string | null
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          display_phone_number?: string | null
          id?: string
          metadata?: Json
          organization_id?: string
          phone_number_id?: string
          status?: string
          updated_at?: string
          whatsapp_business_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          preferred_locale: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          preferred_locale?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          preferred_locale?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      translation_glossary: {
        Row: {
          created_at: string
          id: string
          is_protected: boolean
          notes: string | null
          organization_id: string
          source_language: string
          source_term: string
          target_language: string
          target_term: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_protected?: boolean
          notes?: string | null
          organization_id: string
          source_language: string
          source_term: string
          target_language: string
          target_term: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_protected?: boolean
          notes?: string | null
          organization_id?: string
          source_language?: string
          source_term?: string
          target_language?: string
          target_term?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "translation_glossary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
