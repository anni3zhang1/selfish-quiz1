-- Add linq_chat_id to users table for persistent Linq/iMessage chat threads.
-- Linq uses a chat ID to group messages into a conversation (unlike Twilio which is stateless).
-- Stored after the first message is sent so follow-ups go to the same thread.

ALTER TABLE users ADD COLUMN IF NOT EXISTS linq_chat_id TEXT;

-- Index for quick lookup when receiving inbound webhooks (Linq sends chat ID, we need to find the user)
CREATE INDEX IF NOT EXISTS idx_users_linq_chat_id ON users (linq_chat_id) WHERE linq_chat_id IS NOT NULL;
