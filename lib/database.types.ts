
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "ai_suggestions": {
                  Row: {
                    "approved_at": string | null,"approved_by": string | null,"conversation_id": string,"created_at": string,"created_by": string | null,"detected_language": string | null,"id": string,"input_fingerprint": string | null,"lead_id": string | null,"lead_score": number | null,"model": string | null,"next_action": string | null,"organization_id": string,"status": string,"suggested_reply": string | null,"suggestion_type": string,"summary": string | null
                  }
                  Insert: {
                    "approved_at"?: string | null,"approved_by"?: string | null,"conversation_id": string,"created_at"?: string,"created_by"?: string | null,"detected_language"?: string | null,"id"?: string,"input_fingerprint"?: string | null,"lead_id"?: string | null,"lead_score"?: number | null,"model"?: string | null,"next_action"?: string | null,"organization_id": string,"status"?: string,"suggested_reply"?: string | null,"suggestion_type"?: string,"summary"?: string | null
                  }
                  Update: {
                    "approved_at"?: string | null,"approved_by"?: string | null,"conversation_id"?: string,"created_at"?: string,"created_by"?: string | null,"detected_language"?: string | null,"id"?: string,"input_fingerprint"?: string | null,"lead_id"?: string | null,"lead_score"?: number | null,"model"?: string | null,"next_action"?: string | null,"organization_id"?: string,"status"?: string,"suggested_reply"?: string | null,"suggestion_type"?: string,"summary"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "ai_suggestions_organization_id_approved_by_fkey"
      columns: ["organization_id","approved_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "ai_suggestions_organization_id_conversation_id_fkey"
      columns: ["organization_id","conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "ai_suggestions_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "ai_suggestions_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "ai_suggestions_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"appointments": {
                  Row: {
                    "assigned_to": string | null,"cancellation_reason": string | null,"conversation_id": string | null,"created_at": string,"created_by": string | null,"ends_at": string,"id": string,"lead_id": string,"location": string | null,"meeting_url": string | null,"notes": string | null,"organization_id": string,"starts_at": string,"status": string,"timezone": string,"title": string,"updated_at": string
                  }
                  Insert: {
                    "assigned_to"?: string | null,"cancellation_reason"?: string | null,"conversation_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"ends_at": string,"id"?: string,"lead_id": string,"location"?: string | null,"meeting_url"?: string | null,"notes"?: string | null,"organization_id": string,"starts_at": string,"status"?: string,"timezone"?: string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "assigned_to"?: string | null,"cancellation_reason"?: string | null,"conversation_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"ends_at"?: string,"id"?: string,"lead_id"?: string,"location"?: string | null,"meeting_url"?: string | null,"notes"?: string | null,"organization_id"?: string,"starts_at"?: string,"status"?: string,"timezone"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "appointments_organization_id_assigned_to_fkey"
      columns: ["organization_id","assigned_to"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "appointments_organization_id_conversation_id_fkey"
      columns: ["organization_id","conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "appointments_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "appointments_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"actor_user_id": string | null,"entity_id": string | null,"entity_type": string | null,"id": number,"metadata": NonNullable<Json>,"occurred_at": string,"organization_id": string
                  }
                  Insert: {
                    "action": string,"actor_user_id"?: string | null,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: never,"metadata"?: NonNullable<Json>,"occurred_at"?: string,"organization_id": string
                  }
                  Update: {
                    "action"?: string,"actor_user_id"?: string | null,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: never,"metadata"?: NonNullable<Json>,"occurred_at"?: string,"organization_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_logs_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"automation_rules": {
                  Row: {
                    "actions": NonNullable<Json>,"conditions": NonNullable<Json>,"created_at": string,"created_by": string | null,"id": string,"is_active": boolean,"last_run_at": string | null,"name": string,"organization_id": string,"trigger_type": string,"updated_at": string
                  }
                  Insert: {
                    "actions"?: NonNullable<Json>,"conditions"?: NonNullable<Json>,"created_at"?: string,"created_by"?: string | null,"id"?: string,"is_active"?: boolean,"last_run_at"?: string | null,"name": string,"organization_id": string,"trigger_type": string,"updated_at"?: string
                  }
                  Update: {
                    "actions"?: NonNullable<Json>,"conditions"?: NonNullable<Json>,"created_at"?: string,"created_by"?: string | null,"id"?: string,"is_active"?: boolean,"last_run_at"?: string | null,"name"?: string,"organization_id"?: string,"trigger_type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "automation_rules_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "automation_rules_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"automation_runs": {
                  Row: {
                    "created_at": string,"entity_id": string | null,"entity_type": string | null,"error_message": string | null,"finished_at": string | null,"id": string,"idempotency_key": string | null,"input": NonNullable<Json>,"organization_id": string,"output": NonNullable<Json>,"rule_id": string | null,"started_at": string | null,"status": string,"trigger_type": string
                  }
                  Insert: {
                    "created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"error_message"?: string | null,"finished_at"?: string | null,"id"?: string,"idempotency_key"?: string | null,"input"?: NonNullable<Json>,"organization_id": string,"output"?: NonNullable<Json>,"rule_id"?: string | null,"started_at"?: string | null,"status"?: string,"trigger_type": string
                  }
                  Update: {
                    "created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"error_message"?: string | null,"finished_at"?: string | null,"id"?: string,"idempotency_key"?: string | null,"input"?: NonNullable<Json>,"organization_id"?: string,"output"?: NonNullable<Json>,"rule_id"?: string | null,"started_at"?: string | null,"status"?: string,"trigger_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "automation_runs_organization_id_rule_id_fkey"
      columns: ["organization_id","rule_id"]
isOneToOne: false
      referencedRelation: "automation_rules"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"billing_events": {
                  Row: {
                    "amount": number | null,"created_at": string,"currency": string,"event_type": string,"id": number,"occurred_at": string,"organization_id": string,"payload": NonNullable<Json>,"provider": string,"provider_event_id": string | null,"status": string | null,"subscription_id": string | null
                  }
                  Insert: {
                    "amount"?: number | null,"created_at"?: string,"currency"?: string,"event_type": string,"id"?: never,"occurred_at"?: string,"organization_id": string,"payload"?: NonNullable<Json>,"provider": string,"provider_event_id"?: string | null,"status"?: string | null,"subscription_id"?: string | null
                  }
                  Update: {
                    "amount"?: number | null,"created_at"?: string,"currency"?: string,"event_type"?: string,"id"?: never,"occurred_at"?: string,"organization_id"?: string,"payload"?: NonNullable<Json>,"provider"?: string,"provider_event_id"?: string | null,"status"?: string | null,"subscription_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "billing_events_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "billing_events_subscription_id_fkey"
      columns: ["subscription_id"]
isOneToOne: false
      referencedRelation: "organization_subscriptions"
      referencedColumns: ["id"]
    }
                  ]
                },"billing_plans": {
                  Row: {
                    "annual_price_try": number,"created_at": string,"features": NonNullable<Json>,"id": string,"included_users": number,"is_active": boolean,"monthly_price_try": number,"name": string,"updated_at": string
                  }
                  Insert: {
                    "annual_price_try": number,"created_at"?: string,"features"?: NonNullable<Json>,"id": string,"included_users": number,"is_active"?: boolean,"monthly_price_try": number,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "annual_price_try"?: number,"created_at"?: string,"features"?: NonNullable<Json>,"id"?: string,"included_users"?: number,"is_active"?: boolean,"monthly_price_try"?: number,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"branches": {
                  Row: {
                    "code": string | null,"created_at": string,"id": string,"is_active": boolean,"name": string,"organization_id": string,"timezone": string,"updated_at": string
                  }
                  Insert: {
                    "code"?: string | null,"created_at"?: string,"id"?: string,"is_active"?: boolean,"name": string,"organization_id": string,"timezone"?: string,"updated_at"?: string
                  }
                  Update: {
                    "code"?: string | null,"created_at"?: string,"id"?: string,"is_active"?: boolean,"name"?: string,"organization_id"?: string,"timezone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "branches_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"conversations": {
                  Row: {
                    "agent_language": string | null,"assigned_to": string | null,"channel": string,"closed_at": string | null,"created_at": string,"customer_language": string | null,"external_thread_id": string | null,"handling_mode": string,"handoff_at": string | null,"handoff_by": string | null,"handoff_reason": string | null,"id": string,"last_message_at": string | null,"lead_id": string | null,"organization_id": string,"status": string,"summary": string | null,"unread_count": number,"updated_at": string
                  }
                  Insert: {
                    "agent_language"?: string | null,"assigned_to"?: string | null,"channel": string,"closed_at"?: string | null,"created_at"?: string,"customer_language"?: string | null,"external_thread_id"?: string | null,"handling_mode"?: string,"handoff_at"?: string | null,"handoff_by"?: string | null,"handoff_reason"?: string | null,"id"?: string,"last_message_at"?: string | null,"lead_id"?: string | null,"organization_id": string,"status"?: string,"summary"?: string | null,"unread_count"?: number,"updated_at"?: string
                  }
                  Update: {
                    "agent_language"?: string | null,"assigned_to"?: string | null,"channel"?: string,"closed_at"?: string | null,"created_at"?: string,"customer_language"?: string | null,"external_thread_id"?: string | null,"handling_mode"?: string,"handoff_at"?: string | null,"handoff_by"?: string | null,"handoff_reason"?: string | null,"id"?: string,"last_message_at"?: string | null,"lead_id"?: string | null,"organization_id"?: string,"status"?: string,"summary"?: string | null,"unread_count"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversations_organization_id_assigned_to_fkey"
      columns: ["organization_id","assigned_to"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "conversations_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"deal_lost_reasons": {
                  Row: {
                    "code": string,"created_at": string,"id": string,"is_active": boolean,"label": string,"organization_id": string,"sort_order": number
                  }
                  Insert: {
                    "code": string,"created_at"?: string,"id"?: string,"is_active"?: boolean,"label": string,"organization_id": string,"sort_order"?: number
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"id"?: string,"is_active"?: boolean,"label"?: string,"organization_id"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "deal_lost_reasons_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"deals": {
                  Row: {
                    "amount": number | null,"closed_at": string | null,"created_at": string,"currency": string,"expected_close_date": string | null,"id": string,"lead_id": string,"lost_reason": string | null,"metadata": NonNullable<Json>,"next_action": string | null,"next_action_at": string | null,"organization_id": string,"owner_user_id": string | null,"probability": number,"stage": string,"stage_entered_at": string,"title": string,"updated_at": string
                  }
                  Insert: {
                    "amount"?: number | null,"closed_at"?: string | null,"created_at"?: string,"currency"?: string,"expected_close_date"?: string | null,"id"?: string,"lead_id": string,"lost_reason"?: string | null,"metadata"?: NonNullable<Json>,"next_action"?: string | null,"next_action_at"?: string | null,"organization_id": string,"owner_user_id"?: string | null,"probability"?: number,"stage"?: string,"stage_entered_at"?: string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "amount"?: number | null,"closed_at"?: string | null,"created_at"?: string,"currency"?: string,"expected_close_date"?: string | null,"id"?: string,"lead_id"?: string,"lost_reason"?: string | null,"metadata"?: NonNullable<Json>,"next_action"?: string | null,"next_action_at"?: string | null,"organization_id"?: string,"owner_user_id"?: string | null,"probability"?: number,"stage"?: string,"stage_entered_at"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "deals_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "deals_organization_id_owner_user_id_fkey"
      columns: ["organization_id","owner_user_id"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    }
                  ]
                },"follow_up_escalations": {
                  Row: {
                    "created_at": string,"escalated_by": string,"escalated_to": string,"follow_up_id": string,"id": string,"organization_id": string,"reason": string,"resolved_at": string | null,"resolved_by": string | null,"status": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"escalated_by": string,"escalated_to": string,"follow_up_id": string,"id"?: string,"organization_id": string,"reason": string,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"escalated_by"?: string,"escalated_to"?: string,"follow_up_id"?: string,"id"?: string,"organization_id"?: string,"reason"?: string,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "follow_up_escalations_organization_id_escalated_by_fkey"
      columns: ["organization_id","escalated_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "follow_up_escalations_organization_id_escalated_to_fkey"
      columns: ["organization_id","escalated_to"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "follow_up_escalations_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "follow_up_escalations_organization_id_follow_up_id_fkey"
      columns: ["organization_id","follow_up_id"]
isOneToOne: false
      referencedRelation: "follow_ups"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "follow_up_escalations_organization_id_resolved_by_fkey"
      columns: ["organization_id","resolved_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    }
                  ]
                },"follow_ups": {
                  Row: {
                    "assigned_to": string | null,"attempt_count": number,"completed_at": string | null,"conversation_id": string | null,"created_at": string,"created_by": string | null,"due_at": string,"follow_up_type": string,"id": string,"instructions": string | null,"lead_id": string,"organization_id": string,"payload": NonNullable<Json>,"status": string,"subject": string | null,"updated_at": string
                  }
                  Insert: {
                    "assigned_to"?: string | null,"attempt_count"?: number,"completed_at"?: string | null,"conversation_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"due_at": string,"follow_up_type"?: string,"id"?: string,"instructions"?: string | null,"lead_id": string,"organization_id": string,"payload"?: NonNullable<Json>,"status"?: string,"subject"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "assigned_to"?: string | null,"attempt_count"?: number,"completed_at"?: string | null,"conversation_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"due_at"?: string,"follow_up_type"?: string,"id"?: string,"instructions"?: string | null,"lead_id"?: string,"organization_id"?: string,"payload"?: NonNullable<Json>,"status"?: string,"subject"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "follow_ups_organization_id_assigned_to_fkey"
      columns: ["organization_id","assigned_to"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "follow_ups_organization_id_conversation_id_fkey"
      columns: ["organization_id","conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "follow_ups_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "follow_ups_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"lead_attributions": {
                  Row: {
                    "ad_id": string | null,"ad_name": string | null,"attribution_model": string,"campaign_id": string | null,"campaign_name": string | null,"click_id": string | null,"created_at": string,"first_touch_at": string | null,"id": string,"last_touch_at": string | null,"lead_id": string,"medium": string | null,"organization_id": string,"platform": string,"raw_payload": NonNullable<Json>,"source": string | null,"updated_at": string,"utm_campaign": string | null,"utm_content": string | null,"utm_medium": string | null,"utm_source": string | null
                  }
                  Insert: {
                    "ad_id"?: string | null,"ad_name"?: string | null,"attribution_model"?: string,"campaign_id"?: string | null,"campaign_name"?: string | null,"click_id"?: string | null,"created_at"?: string,"first_touch_at"?: string | null,"id"?: string,"last_touch_at"?: string | null,"lead_id": string,"medium"?: string | null,"organization_id": string,"platform"?: string,"raw_payload"?: NonNullable<Json>,"source"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Update: {
                    "ad_id"?: string | null,"ad_name"?: string | null,"attribution_model"?: string,"campaign_id"?: string | null,"campaign_name"?: string | null,"click_id"?: string | null,"created_at"?: string,"first_touch_at"?: string | null,"id"?: string,"last_touch_at"?: string | null,"lead_id"?: string,"medium"?: string | null,"organization_id"?: string,"platform"?: string,"raw_payload"?: NonNullable<Json>,"source"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "lead_attributions_organization_id_ad_id_fkey"
      columns: ["organization_id","ad_id"]
isOneToOne: false
      referencedRelation: "marketing_ads"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "lead_attributions_organization_id_campaign_id_fkey"
      columns: ["organization_id","campaign_id"]
isOneToOne: false
      referencedRelation: "marketing_campaigns"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "lead_attributions_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "lead_attributions_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"lead_events": {
                  Row: {
                    "actor_user_id": string | null,"event_type": string,"from_value": string | null,"id": number,"lead_id": string,"metadata": NonNullable<Json>,"occurred_at": string,"organization_id": string,"to_value": string | null
                  }
                  Insert: {
                    "actor_user_id"?: string | null,"event_type": string,"from_value"?: string | null,"id"?: never,"lead_id": string,"metadata"?: NonNullable<Json>,"occurred_at"?: string,"organization_id": string,"to_value"?: string | null
                  }
                  Update: {
                    "actor_user_id"?: string | null,"event_type"?: string,"from_value"?: string | null,"id"?: never,"lead_id"?: string,"metadata"?: NonNullable<Json>,"occurred_at"?: string,"organization_id"?: string,"to_value"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "lead_events_organization_id_actor_user_id_fkey"
      columns: ["organization_id","actor_user_id"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "lead_events_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"lead_qualifications": {
                  Row: {
                    "answers": NonNullable<Json>,"budget_fit": string | null,"confidence": number | null,"created_at": string,"created_by": string | null,"decision_role": string | null,"id": string,"lead_id": string,"missing_fields": (string)[],"need_summary": string | null,"organization_id": string,"preferred_area": string | null,"property_type": string | null,"purpose": string | null,"qualified_by": string,"timeline": string | null,"version": number
                  }
                  Insert: {
                    "answers"?: NonNullable<Json>,"budget_fit"?: string | null,"confidence"?: number | null,"created_at"?: string,"created_by"?: string | null,"decision_role"?: string | null,"id"?: string,"lead_id": string,"missing_fields"?: (string)[],"need_summary"?: string | null,"organization_id": string,"preferred_area"?: string | null,"property_type"?: string | null,"purpose"?: string | null,"qualified_by"?: string,"timeline"?: string | null,"version"?: number
                  }
                  Update: {
                    "answers"?: NonNullable<Json>,"budget_fit"?: string | null,"confidence"?: number | null,"created_at"?: string,"created_by"?: string | null,"decision_role"?: string | null,"id"?: string,"lead_id"?: string,"missing_fields"?: (string)[],"need_summary"?: string | null,"organization_id"?: string,"preferred_area"?: string | null,"property_type"?: string | null,"purpose"?: string | null,"qualified_by"?: string,"timeline"?: string | null,"version"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "lead_qualifications_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "lead_qualifications_organization_id_lead_id_fkey"
      columns: ["organization_id","lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"lead_sources": {
                  Row: {
                    "channel": string,"configuration": NonNullable<Json>,"created_at": string,"external_account_id": string | null,"id": string,"is_active": boolean,"name": string,"organization_id": string,"updated_at": string
                  }
                  Insert: {
                    "channel": string,"configuration"?: NonNullable<Json>,"created_at"?: string,"external_account_id"?: string | null,"id"?: string,"is_active"?: boolean,"name": string,"organization_id": string,"updated_at"?: string
                  }
                  Update: {
                    "channel"?: string,"configuration"?: NonNullable<Json>,"created_at"?: string,"external_account_id"?: string | null,"id"?: string,"is_active"?: boolean,"name"?: string,"organization_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lead_sources_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"leads": {
                  Row: {
                    "ad_name": string | null,"assigned_to": string | null,"attribution": NonNullable<Json>,"branch_id": string | null,"budget_max": number | null,"budget_min": number | null,"campaign_name": string | null,"city": string | null,"consent_at": string | null,"consent_status": string,"country": string | null,"created_at": string,"created_by": string | null,"currency": string,"detected_language": string | null,"email": string | null,"external_ref": string | null,"full_name": string,"id": string,"intent": string | null,"last_contact_at": string | null,"lost_reason": string | null,"organization_id": string,"phone": string | null,"preferred_language": string,"priority": string,"qualified_at": string | null,"score": number,"source_channel": string | null,"source_id": string | null,"status": string,"timeline": string | null,"updated_at": string,"utm_campaign": string | null,"utm_medium": string | null,"utm_source": string | null,"whatsapp_phone": string | null,"won_at": string | null
                  }
                  Insert: {
                    "ad_name"?: string | null,"assigned_to"?: string | null,"attribution"?: NonNullable<Json>,"branch_id"?: string | null,"budget_max"?: number | null,"budget_min"?: number | null,"campaign_name"?: string | null,"city"?: string | null,"consent_at"?: string | null,"consent_status"?: string,"country"?: string | null,"created_at"?: string,"created_by"?: string | null,"currency"?: string,"detected_language"?: string | null,"email"?: string | null,"external_ref"?: string | null,"full_name": string,"id"?: string,"intent"?: string | null,"last_contact_at"?: string | null,"lost_reason"?: string | null,"organization_id": string,"phone"?: string | null,"preferred_language"?: string,"priority"?: string,"qualified_at"?: string | null,"score"?: number,"source_channel"?: string | null,"source_id"?: string | null,"status"?: string,"timeline"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null,"whatsapp_phone"?: string | null,"won_at"?: string | null
                  }
                  Update: {
                    "ad_name"?: string | null,"assigned_to"?: string | null,"attribution"?: NonNullable<Json>,"branch_id"?: string | null,"budget_max"?: number | null,"budget_min"?: number | null,"campaign_name"?: string | null,"city"?: string | null,"consent_at"?: string | null,"consent_status"?: string,"country"?: string | null,"created_at"?: string,"created_by"?: string | null,"currency"?: string,"detected_language"?: string | null,"email"?: string | null,"external_ref"?: string | null,"full_name"?: string,"id"?: string,"intent"?: string | null,"last_contact_at"?: string | null,"lost_reason"?: string | null,"organization_id"?: string,"phone"?: string | null,"preferred_language"?: string,"priority"?: string,"qualified_at"?: string | null,"score"?: number,"source_channel"?: string | null,"source_id"?: string | null,"status"?: string,"timeline"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null,"whatsapp_phone"?: string | null,"won_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "leads_assigned_fk"
      columns: ["organization_id","assigned_to"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "leads_branch_fk"
      columns: ["organization_id","branch_id"]
isOneToOne: false
      referencedRelation: "branches"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "leads_created_by_fk"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "leads_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "leads_source_fk"
      columns: ["organization_id","source_id"]
isOneToOne: false
      referencedRelation: "lead_sources"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"marketing_ads": {
                  Row: {
                    "adset_name": string | null,"campaign_id": string,"created_at": string,"creative_name": string | null,"destination": string | null,"external_ad_id": string | null,"external_adset_id": string | null,"id": string,"metadata": NonNullable<Json>,"name": string,"organization_id": string,"status": string,"updated_at": string
                  }
                  Insert: {
                    "adset_name"?: string | null,"campaign_id": string,"created_at"?: string,"creative_name"?: string | null,"destination"?: string | null,"external_ad_id"?: string | null,"external_adset_id"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"name": string,"organization_id": string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "adset_name"?: string | null,"campaign_id"?: string,"created_at"?: string,"creative_name"?: string | null,"destination"?: string | null,"external_ad_id"?: string | null,"external_adset_id"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"name"?: string,"organization_id"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "marketing_ads_organization_id_campaign_id_fkey"
      columns: ["organization_id","campaign_id"]
isOneToOne: false
      referencedRelation: "marketing_campaigns"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "marketing_ads_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"marketing_campaigns": {
                  Row: {
                    "created_at": string,"currency": string,"external_campaign_id": string | null,"id": string,"metadata": NonNullable<Json>,"name": string,"objective": string | null,"organization_id": string,"platform": string,"status": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"currency"?: string,"external_campaign_id"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"name": string,"objective"?: string | null,"organization_id": string,"platform": string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"currency"?: string,"external_campaign_id"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"name"?: string,"objective"?: string | null,"organization_id"?: string,"platform"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "marketing_campaigns_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"marketing_daily_metrics": {
                  Row: {
                    "ad_id": string | null,"appointments_count": number,"campaign_id": string | null,"clicks": number,"created_at": string,"currency": string,"id": number,"impressions": number,"leads_count": number,"metadata": NonNullable<Json>,"metric_date": string,"organization_id": string,"qualified_leads_count": number,"reach": number,"revenue": number,"spend": number,"updated_at": string,"won_deals_count": number
                  }
                  Insert: {
                    "ad_id"?: string | null,"appointments_count"?: number,"campaign_id"?: string | null,"clicks"?: number,"created_at"?: string,"currency"?: string,"id"?: number,"impressions"?: number,"leads_count"?: number,"metadata"?: NonNullable<Json>,"metric_date": string,"organization_id": string,"qualified_leads_count"?: number,"reach"?: number,"revenue"?: number,"spend"?: number,"updated_at"?: string,"won_deals_count"?: number
                  }
                  Update: {
                    "ad_id"?: string | null,"appointments_count"?: number,"campaign_id"?: string | null,"clicks"?: number,"created_at"?: string,"currency"?: string,"id"?: number,"impressions"?: number,"leads_count"?: number,"metadata"?: NonNullable<Json>,"metric_date"?: string,"organization_id"?: string,"qualified_leads_count"?: number,"reach"?: number,"revenue"?: number,"spend"?: number,"updated_at"?: string,"won_deals_count"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "marketing_daily_metrics_organization_id_ad_id_fkey"
      columns: ["organization_id","ad_id"]
isOneToOne: false
      referencedRelation: "marketing_ads"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "marketing_daily_metrics_organization_id_campaign_id_fkey"
      columns: ["organization_id","campaign_id"]
isOneToOne: false
      referencedRelation: "marketing_campaigns"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "marketing_daily_metrics_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"messages": {
                  Row: {
                    "conversation_id": string,"created_at": string,"delivered_at": string | null,"delivery_status": string,"direction": string,"external_message_id": string | null,"failure_reason": string | null,"id": string,"media_url": string | null,"message_type": string,"organization_id": string,"original_language": string | null,"original_text": string | null,"protected_entities": NonNullable<Json>,"raw_payload": NonNullable<Json>,"read_at": string | null,"sender_type": string,"sender_user_id": string | null,"sent_at": string | null,"translated_language": string | null,"translated_text": string | null,"translation_confidence": number | null,"translation_provider": string | null,"translation_review_required": boolean,"translation_reviewed_at": string | null,"translation_reviewed_by": string | null,"translation_status": string
                  }
                  Insert: {
                    "conversation_id": string,"created_at"?: string,"delivered_at"?: string | null,"delivery_status"?: string,"direction": string,"external_message_id"?: string | null,"failure_reason"?: string | null,"id"?: string,"media_url"?: string | null,"message_type"?: string,"organization_id": string,"original_language"?: string | null,"original_text"?: string | null,"protected_entities"?: NonNullable<Json>,"raw_payload"?: NonNullable<Json>,"read_at"?: string | null,"sender_type": string,"sender_user_id"?: string | null,"sent_at"?: string | null,"translated_language"?: string | null,"translated_text"?: string | null,"translation_confidence"?: number | null,"translation_provider"?: string | null,"translation_review_required"?: boolean,"translation_reviewed_at"?: string | null,"translation_reviewed_by"?: string | null,"translation_status"?: string
                  }
                  Update: {
                    "conversation_id"?: string,"created_at"?: string,"delivered_at"?: string | null,"delivery_status"?: string,"direction"?: string,"external_message_id"?: string | null,"failure_reason"?: string | null,"id"?: string,"media_url"?: string | null,"message_type"?: string,"organization_id"?: string,"original_language"?: string | null,"original_text"?: string | null,"protected_entities"?: NonNullable<Json>,"raw_payload"?: NonNullable<Json>,"read_at"?: string | null,"sender_type"?: string,"sender_user_id"?: string | null,"sent_at"?: string | null,"translated_language"?: string | null,"translated_text"?: string | null,"translation_confidence"?: number | null,"translation_provider"?: string | null,"translation_review_required"?: boolean,"translation_reviewed_at"?: string | null,"translation_reviewed_by"?: string | null,"translation_status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "messages_organization_id_conversation_id_fkey"
      columns: ["organization_id","conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["organization_id","id"]
    },{
      foreignKeyName: "messages_organization_id_sender_user_id_fkey"
      columns: ["organization_id","sender_user_id"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "body": string | null,"created_at": string,"entity_id": string | null,"entity_type": string | null,"id": string,"is_read": boolean,"notification_type": string,"organization_id": string,"read_at": string | null,"title": string,"user_id": string
                  }
                  Insert: {
                    "body"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: string,"is_read"?: boolean,"notification_type": string,"organization_id": string,"read_at"?: string | null,"title": string,"user_id": string
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: string,"is_read"?: boolean,"notification_type"?: string,"organization_id"?: string,"read_at"?: string | null,"title"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_organization_id_user_id_fkey"
      columns: ["organization_id","user_id"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    }
                  ]
                },"organization_bootstrap_requests": {
                  Row: {
                    "created_at": string,"created_organization_id": string | null,"locale": string,"member_full_name": string,"organization_name": string,"organization_slug": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"created_organization_id"?: string | null,"locale"?: string,"member_full_name": string,"organization_name": string,"organization_slug": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"created_organization_id"?: string | null,"locale"?: string,"member_full_name"?: string,"organization_name"?: string,"organization_slug"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "organization_bootstrap_requests_created_organization_id_fkey"
      columns: ["created_organization_id"]
isOneToOne: true
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"organization_members": {
                  Row: {
                    "created_at": string,"job_title": string | null,"organization_id": string,"preferred_locale": string | null,"role": string,"status": string,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"job_title"?: string | null,"organization_id": string,"preferred_locale"?: string | null,"role"?: string,"status"?: string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"job_title"?: string | null,"organization_id"?: string,"preferred_locale"?: string | null,"role"?: string,"status"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "organization_members_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"organization_subscriptions": {
                  Row: {
                    "billing_cycle": string,"cancel_at_period_end": boolean,"created_at": string,"current_period_end": string | null,"current_period_start": string | null,"id": string,"metadata": NonNullable<Json>,"organization_id": string,"plan_id": string,"provider": string,"provider_subscription_id": string | null,"status": string,"trial_ends_at": string | null,"updated_at": string
                  }
                  Insert: {
                    "billing_cycle"?: string,"cancel_at_period_end"?: boolean,"created_at"?: string,"current_period_end"?: string | null,"current_period_start"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"organization_id": string,"plan_id": string,"provider"?: string,"provider_subscription_id"?: string | null,"status"?: string,"trial_ends_at"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "billing_cycle"?: string,"cancel_at_period_end"?: boolean,"created_at"?: string,"current_period_end"?: string | null,"current_period_start"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"organization_id"?: string,"plan_id"?: string,"provider"?: string,"provider_subscription_id"?: string | null,"status"?: string,"trial_ends_at"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "organization_subscriptions_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: true
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "organization_subscriptions_plan_id_fkey"
      columns: ["plan_id"]
isOneToOne: false
      referencedRelation: "billing_plans"
      referencedColumns: ["id"]
    }
                  ]
                },"organizations": {
                  Row: {
                    "created_at": string,"default_locale": string,"id": string,"name": string,"slug": string,"status": string,"timezone": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"default_locale"?: string,"id"?: string,"name": string,"slug": string,"status"?: string,"timezone"?: string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"default_locale"?: string,"id"?: string,"name"?: string,"slug"?: string,"status"?: string,"timezone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"full_name": string | null,"preferred_locale": string,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"full_name"?: string | null,"preferred_locale"?: string,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"full_name"?: string | null,"preferred_locale"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"quote_items": {
                  Row: {
                    "created_at": string,"description": string,"discount_percent": number,"id": string,"line_discount": number,"line_subtotal": number,"line_tax": number,"line_total": number,"organization_id": string,"quantity": number,"quote_id": string,"sort_order": number,"tax_percent": number,"unit_price": number
                  }
                  Insert: {
                    "created_at"?: string,"description": string,"discount_percent"?: number,"id"?: string,"line_discount": number,"line_subtotal": number,"line_tax": number,"line_total": number,"organization_id": string,"quantity": number,"quote_id": string,"sort_order"?: number,"tax_percent"?: number,"unit_price": number
                  }
                  Update: {
                    "created_at"?: string,"description"?: string,"discount_percent"?: number,"id"?: string,"line_discount"?: number,"line_subtotal"?: number,"line_tax"?: number,"line_total"?: number,"organization_id"?: string,"quantity"?: number,"quote_id"?: string,"sort_order"?: number,"tax_percent"?: number,"unit_price"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "quote_items_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "quote_items_quote_id_fkey"
      columns: ["quote_id"]
isOneToOne: false
      referencedRelation: "quotes"
      referencedColumns: ["id"]
    }
                  ]
                },"quotes": {
                  Row: {
                    "accepted_at": string | null,"created_at": string,"created_by": string,"currency": string,"deal_id": string,"discount_total": number,"id": string,"lead_id": string,"notes": string | null,"organization_id": string,"quote_number": string,"sent_at": string | null,"status": string,"subtotal": number,"tax_total": number,"total": number,"updated_at": string,"valid_until": string | null
                  }
                  Insert: {
                    "accepted_at"?: string | null,"created_at"?: string,"created_by": string,"currency": string,"deal_id": string,"discount_total"?: number,"id"?: string,"lead_id": string,"notes"?: string | null,"organization_id": string,"quote_number"?: string,"sent_at"?: string | null,"status"?: string,"subtotal"?: number,"tax_total"?: number,"total"?: number,"updated_at"?: string,"valid_until"?: string | null
                  }
                  Update: {
                    "accepted_at"?: string | null,"created_at"?: string,"created_by"?: string,"currency"?: string,"deal_id"?: string,"discount_total"?: number,"id"?: string,"lead_id"?: string,"notes"?: string | null,"organization_id"?: string,"quote_number"?: string,"sent_at"?: string | null,"status"?: string,"subtotal"?: number,"tax_total"?: number,"total"?: number,"updated_at"?: string,"valid_until"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "quotes_deal_id_fkey"
      columns: ["deal_id"]
isOneToOne: false
      referencedRelation: "deals"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "quotes_lead_id_fkey"
      columns: ["lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "quotes_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"store_connections": {
                  Row: {
                    "created_at": string,"created_by": string | null,"credential_env_key": string | null,"display_name": string | null,"external_store_id": string,"id": string,"last_error_at": string | null,"last_error_code": string | null,"last_ingested_at": string | null,"organization_id": string,"provider": string,"status": string,"store_domain": string,"updated_at": string,"webhook_secret_env_key": string | null
                  }
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"credential_env_key"?: string | null,"display_name"?: string | null,"external_store_id": string,"id"?: string,"last_error_at"?: string | null,"last_error_code"?: string | null,"last_ingested_at"?: string | null,"organization_id": string,"provider": string,"status"?: string,"store_domain": string,"updated_at"?: string,"webhook_secret_env_key"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"credential_env_key"?: string | null,"display_name"?: string | null,"external_store_id"?: string,"id"?: string,"last_error_at"?: string | null,"last_error_code"?: string | null,"last_ingested_at"?: string | null,"organization_id"?: string,"provider"?: string,"status"?: string,"store_domain"?: string,"updated_at"?: string,"webhook_secret_env_key"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "store_connections_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "store_connections_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"store_ingestion_events": {
                  Row: {
                    "connection_id": string,"event_type": string,"external_customer_id": string | null,"external_event_id": string,"external_order_id": string | null,"failure_code": string | null,"id": string,"normalized_payload": NonNullable<Json>,"organization_id": string,"payload": NonNullable<Json>,"processed_at": string | null,"processing_status": string,"provider": string,"received_at": string
                  }
                  Insert: {
                    "connection_id": string,"event_type": string,"external_customer_id"?: string | null,"external_event_id": string,"external_order_id"?: string | null,"failure_code"?: string | null,"id"?: string,"normalized_payload"?: NonNullable<Json>,"organization_id": string,"payload"?: NonNullable<Json>,"processed_at"?: string | null,"processing_status"?: string,"provider": string,"received_at"?: string
                  }
                  Update: {
                    "connection_id"?: string,"event_type"?: string,"external_customer_id"?: string | null,"external_event_id"?: string,"external_order_id"?: string | null,"failure_code"?: string | null,"id"?: string,"normalized_payload"?: NonNullable<Json>,"organization_id"?: string,"payload"?: NonNullable<Json>,"processed_at"?: string | null,"processing_status"?: string,"provider"?: string,"received_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "store_ingestion_events_organization_id_connection_id_fkey"
      columns: ["organization_id","connection_id"]
isOneToOne: false
      referencedRelation: "store_connections"
      referencedColumns: ["organization_id","id"]
    }
                  ]
                },"translation_glossary": {
                  Row: {
                    "created_at": string,"id": string,"is_protected": boolean,"notes": string | null,"organization_id": string,"source_language": string,"source_term": string,"target_language": string,"target_term": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"is_protected"?: boolean,"notes"?: string | null,"organization_id": string,"source_language": string,"source_term": string,"target_language": string,"target_term": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"is_protected"?: boolean,"notes"?: string | null,"organization_id"?: string,"source_language"?: string,"source_term"?: string,"target_language"?: string,"target_term"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "translation_glossary_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"whatsapp_connections": {
                  Row: {
                    "access_token_env_key": string | null,"created_at": string,"created_by": string | null,"display_name": string | null,"display_phone_number": string | null,"id": string,"metadata": NonNullable<Json>,"organization_id": string,"phone_number_id": string,"status": string,"updated_at": string,"whatsapp_business_account_id": string | null
                  }
                  Insert: {
                    "access_token_env_key"?: string | null,"created_at"?: string,"created_by"?: string | null,"display_name"?: string | null,"display_phone_number"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"organization_id": string,"phone_number_id": string,"status"?: string,"updated_at"?: string,"whatsapp_business_account_id"?: string | null
                  }
                  Update: {
                    "access_token_env_key"?: string | null,"created_at"?: string,"created_by"?: string | null,"display_name"?: string | null,"display_phone_number"?: string | null,"id"?: string,"metadata"?: NonNullable<Json>,"organization_id"?: string,"phone_number_id"?: string,"status"?: string,"updated_at"?: string,"whatsapp_business_account_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "whatsapp_connections_organization_id_created_by_fkey"
      columns: ["organization_id","created_by"]
isOneToOne: false
      referencedRelation: "organization_members"
      referencedColumns: ["organization_id","user_id"]
    },{
      foreignKeyName: "whatsapp_connections_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "execute_approved_ai_suggestion":
{ Args: { "p_organization_id": string,"p_suggestion_id": string }; Returns: string
                           },
"get_owner_employee_performance":
{ Args: { "p_from"?: string,"p_organization_id": string,"p_to"?: string }; Returns: {
              "appointments_completed": number,"appointments_total": number,"followups_completed": number,"full_name": string,"leads_assigned": number,"leads_qualified": number,"leads_won": number,"overdue_followups": number,"role": string,"user_id": string,"won_deals": number,"won_revenue_by_currency": Json
            }[]
                           },
"get_owner_marketing_performance":
{ Args: { "p_from"?: string,"p_organization_id": string,"p_to"?: string }; Returns: {
              "appointments_count": number,"campaign_id": string,"campaign_name": string,"clicks": number,"cpl": number,"currency": string,"impressions": number,"leads_count": number,"platform": string,"qualified_leads_count": number,"reach": number,"revenue": number,"roas": number,"spend": number,"won_deals_count": number
            }[]
                           },
"get_platform_company_overview":
{ Args: Record<PropertyKey, never>; Returns: {
              "billing_cycle": string,"created_at": string,"current_period_end": string,"included_users": number,"member_count": number,"organization_id": string,"organization_name": string,"plan_id": string,"subscription_status": string,"trial_ends_at": string
            }[]
                           },
"get_platform_service_overview":
{ Args: Record<PropertyKey, never>; Returns: {
              "organization_id": string,"reason": string,"service_key": string,"status": string,"updated_at": string
            }[]
                           },
"get_subscription_entitlements":
{ Args: { "p_organization_id": string }; Returns: {
              "billing_cycle": string,"current_period_end": string,"features": Json,"included_users": number,"is_access_active": boolean,"plan_id": string,"subscription_status": string,"trial_ends_at": string
            }[]
                           },
"resume_conversation_ai":
{ Args: { "p_conversation_id": string }; Returns: boolean
                           },
"set_platform_service_status":
{ Args: { "p_organization_id": string,"p_reason": string,"p_service_key": string,"p_status": string }; Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const

