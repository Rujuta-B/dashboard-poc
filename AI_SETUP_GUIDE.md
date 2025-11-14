# AI Form Generator Setup Guide

## Quick Setup (2 minutes)

### Step 1: Get an OpenAI API Key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...` or `sk-...`)

### Step 2: Add to Environment

Create `.env.local` in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add your key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Step 3: Restart the Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Test It!

Visit [http://localhost:3000/ai-form-generator](http://localhost:3000/ai-form-generator) and try:

```
Create a contact form with name, email, phone, message, and newsletter subscription
```

## ✅ Verification

If everything works, you'll see:
- ✅ Generated form with proper fields
- ✅ Validation rules applied
- ✅ Live preview
- ✅ JSON schema

## ❌ Troubleshooting

### Error: "Failed to generate form"

**Check the terminal for the actual error:**

#### 1. Quota Exceeded
```
Error: You exceeded your current quota
```

**Solution:** Add credits to your OpenAI account:
- Visit https://platform.openai.com/account/billing
- Add payment method
- Add credits (minimum $5 recommended)

#### 2. Invalid API Key
```
Error: Invalid API key
```

**Solution:**
- Check `.env.local` has the correct key
- Key should start with `sk-`
- No spaces or quotes around the key
- Restart the dev server after changing `.env.local`

#### 3. No API Key Set
```
Error: API key not found
```

**Solution:**
- Ensure `.env.local` exists in project root
- File should contain `OPENAI_API_KEY=sk-...`
- Restart dev server

### Still Not Working?

Check the terminal output when you submit the form. The detailed error will appear there.

## 💰 Pricing

OpenAI GPT-4o pricing (as of Nov 2024):
- **Input:** $2.50 per 1M tokens
- **Output:** $10.00 per 1M tokens

**Form generation typically uses:**
- ~500-1000 input tokens (description + prompt)
- ~500-2000 output tokens (generated form JSON)

**Estimated cost per form:** $0.01 - $0.03 (1-3 cents)

## 🔒 Security

✅ **Your API key is safe:**
- Never sent to the client
- Only used in Server Actions
- Not included in client-side bundles
- Environment variables are server-only

✅ **Best practices:**
- Don't commit `.env.local` to git (already in `.gitignore`)
- Use separate API keys for dev/production
- Set usage limits in OpenAI dashboard
- Monitor usage regularly

## 🎓 Without API Key

The AI Form Generator requires an OpenAI API key to work. However, all other features of the dashboard builder work perfectly without it:

✅ Works without API key:
- Dashboard builder
- Drag & drop widgets
- React 19 features demos
- Next.js 15 features demos
- All UI components

❌ Requires API key:
- AI Form Generator (`/ai-form-generator`)

## 📚 Alternative: Mock Data

If you want to test the UI without an API key, you can create mock form data manually. See `AI_FORM_GENERATOR.md` for the JSON schema format.

## 🚀 Production Deployment

When deploying to Vercel/other platforms:

1. Add `OPENAI_API_KEY` to environment variables in dashboard
2. Don't use the same key as development (create a new one)
3. Set up billing alerts in OpenAI dashboard
4. Monitor usage and costs

## ❓ FAQ

**Q: Do I need a paid OpenAI account?**
A: Yes, you need credits in your account. Free trial credits work too!

**Q: Can I use a different AI model?**
A: Yes! Edit `app/actions/ai-form-generator.ts` and change `gpt-4o` to `gpt-3.5-turbo` for cheaper costs.

**Q: How much will this cost me?**
A: Very little! Each form generation costs 1-3 cents. $5 credit = ~200-500 forms.

**Q: Is my API key secure?**
A: Yes, it's only used server-side in Next.js Server Actions and never exposed to the client.

**Q: Can I rate limit form generation?**
A: Yes! Implement rate limiting in the Server Action. See `AI_FORM_GENERATOR.md` for examples.

## 🛠️ Advanced Configuration

### Use GPT-3.5 Instead (Cheaper)

Edit `app/actions/ai-form-generator.ts`:

```typescript
model: openai('gpt-3.5-turbo'),  // Instead of gpt-4o
```

**Pros:** ~10x cheaper
**Cons:** Slightly less accurate form generation

### Add Caching

```typescript
const formCache = new Map<string, GeneratedForm>()

export async function generateFormFromDescription(description: string) {
  const cached = formCache.get(description)
  if (cached) return { success: true, form: cached }
  
  // ... generate form ...
  
  formCache.set(description, object)
  return { success: true, form: object }
}
```

## 📞 Support

- OpenAI API Issues: https://help.openai.com
- Dashboard Issues: Check `AI_FORM_GENERATOR.md` for troubleshooting
- Billing Questions: https://platform.openai.com/account/billing

---

**Ready to generate forms with AI!** 🤖✨
