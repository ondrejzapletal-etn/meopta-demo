COPILOT-READY TECHNICAL TASK BREAKDOWN
AI CHAT + AGENTI + KONTEXT PRO PAYLOAD CMS
1. UI ARCHITEKTURA CHATU
Levé menu Payload

Přidat nový admin nav item:

AI Chat

route:

/admin/ai-chat
Chování po kliknutí

Neotevírat novou stránku.

Musí otevřít modal/chat panel.

Modal positioning

Chat panel bude:

přilepený k pravé hraně levého Payload menu
přilepený ke spodní hraně viewportu
floating overlay nad admin obsahem
Přesné umístění
position: fixed;
left: var(--nav-width);
bottom: 0;
height: 78vh;
width: 460px;
z-index: 9999;
MVP responsive behavior

Pokud width < 1200px:

width: calc(100vw - var(--nav-width));
Vizuální chování

Horní hrana:

zaoblená pouze nahoře:

border-radius: 16px 16px 0 0;

Shadow:

box-shadow: large admin shadow

Background:

Payload admin background compatible.

Modal layout

3 části:

Header
AI Chat
[current page title if exists]

Buttons:

New chat
Close
Conversation body

Scrollable.

Messages:

user right aligned
assistant left aligned
Input footer

Textarea:

auto-grow max 5 lines.

Buttons:

Send

Quick actions:

Analyze page
Generate metadata
Create page
Soubor
/src/components/AIChat/AIChatModal.tsx
2. ADMIN TRIGGER IMPLEMENTACE

Payload custom nav component:

soubor:

/src/components/AdminNav/AIChatTrigger.tsx

Task:

inject custom item do admin navigation.

Kliknutí:

otevře modal state.

Použít global state:

useAIChatStore()
3. CHAT STATE MANAGEMENT

Soubor:

/src/store/aiChatStore.ts

State:

isOpen
messages
currentContext
loading
currentDocument
currentCollection
Messages schema
type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
Limit historie

držet max:

6 messages

Automaticky trim staré.

4. PAGE CONTEXT AUTO-DETECTION

Pokud user otevře page editor:

automaticky číst:

document id
collection
title
slug
seo fields
content summary

Zdroj:

Payload edit form context.

Soubor:

/src/ai/context/getCurrentDocumentContext.ts
Auto attach context při dotazu

Při send message:

pokud current page existuje:

append page context.

5. CHAT API ENDPOINT

Soubor:

/src/app/api/ai/chat/route.ts

POST input:

{
  message,
  history,
  currentDocumentId,
  collection
}
Server pipeline

intent detect

load relevant context

select agent

OpenAI call

structured response

6. INTENT ROUTER

Soubor:

/src/ai/orchestrator/chatRouter.ts

Rules MVP:

meta/title/description => metadataAgent
seo => seoAgent
geo => geoAgent
create/new page => pageCreationAgent
similar/internal links => siteKnowledgeAgent
where/how edit => cmsHelpAgent
fallback => general agent
7. AGENT FILES

Adresář:

/src/ai/agents

Soubory:

seoAgent.ts

vrací:

score
issues
fixes
geoAgent.ts

vrací:

entity clarity
AI readability
snippet quality
metadataAgent.ts

vrací:

title
metaDescription
pageCreationAgent.ts

vrací:

draft payload JSON
siteKnowledgeAgent.ts

vrací:

related pages
duplicates
internal links
cmsHelpAgent.ts

vrací:

CMS instructions.

8. BUSINESS CONTEXT IMPLEMENTACE

Payload Global:

business-context

Soubor:

/src/globals/BusinessContext.ts

Fields:

companyName
businessDescription
targetAudience
communicationStyle
services
seoPriorities
brandVoice
forbiddenPhrases
editorialRules
importantEntities
competitors
Chat endpoint vždy načte relevant subset.
9. SITE KNOWLEDGE IMPLEMENTACE

Každý page/article:

hidden field:

aiSummary

Soubor:

/src/hooks/generateAISummary.ts

On save:

vygeneruje summary.

Max:

2 věty.

10. CREATE PAGE FLOW

User prompt:

Create page about optical telescopes

Agent vrací:

preview.

UI zobrazí:

Create draft?

button:

Approve

Po approve:

endpoint:

/api/ai/create-page
create-page endpoint

Soubor:

/src/app/api/ai/create-page/route.ts

Použít:

payload.create()

Status vždy:

draft

Nikdy publish.

11. DUPLICATE CHECK

Před create:

spustit:

siteKnowledgeAgent.

Kontrolovat:

slug
title
semantic similarity
12. AI VALIDATION TAB NA PAGE

Soubor:

/src/components/PageAIValidation.tsx

Sekce:

SEO Validation
GEO Validation

Buttons:

Run SEO
Run GEO
Výsledky ukládat do hidden fields
aiValidation.seo
aiValidation.geo
aiValidation.updatedAt
13. MODAL CHAT UX DETAILY

Po otevření:

focus rovnou do inputu.

Enter:

send.

Shift+Enter:

newline.

Loading state

assistant bubble:

Thinking...
Auto scroll dolů

při každé nové zprávě.

14. ERROR HANDLING

Pokud API fail:

assistant:

Request failed. Try again.
15. TOKEN OPTIMALIZATION

Nikdy neposílat celý rich text.

Pouze summary.

Page context max:
1200 tokens

Business context subset only.

Site summaries max 5.

16. SOUBOROVÁ STRUKTURA
/src/ai
  /agents
  /context
  /prompts
  /orchestrator
  /schemas

/src/components/AIChat
/src/components/AdminNav
/src/store
/src/hooks
/src/app/api/ai
17. MVP CO ZATÍM NEŘEŠIT

❌ více chat vláken
❌ embeddings DB
❌ vector search
❌ autonomous audit scheduling
❌ auto publish