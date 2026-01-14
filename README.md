# Respond.io TypeScript SDK

A professional, type-safe TypeScript SDK for the [respond.io](https://respond.io) Developer API v2.

[![npm version](https://img.shields.io/npm/v/@respond-io/typescript-sdk.svg)](https://www.npmjs.com/package/@respond-io/typescript-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@respond-io/typescript-sdk.svg)](LICENSE)
[![Test Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen.svg)](coverage)

## Features

- 🎯 **Full Type Safety** - Complete TypeScript definitions for all API endpoints
- 🔄 **Automatic Retries** - Built-in retry logic for failed requests with exponential backoff
- ⚡ **Rate Limiting** - Automatic handling of rate limits with retry-after headers
- 🛡️ **Error Handling** - Comprehensive error handling with detailed error messages
- 📦 **Modern API** - Clean, intuitive API design inspired by AWS SDK v3
- 🔍 **Fully Documented** - Extensive JSDoc comments and usage examples
- ✅ **Well Tested** - 80%+ test coverage with Jest

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
  - [Contacts](#contacts)
  - [Messaging](#messaging)
  - [Comments](#comments)
  - [Conversations](#conversations)
  - [Space (Workspace)](#space-workspace)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```bash
npm install @respond-io/typescript-sdk

# or using yarn
yarn add @respond-io/typescript-sdk

# or using pnpm
pnpm add @respond-io/typescript-sdk
```

## Quick Start

```typescript
import { RespondIO } from '@respond-io/typescript-sdk';

const client = new RespondIO({
  apiToken: 'your-api-token',
});

// Get a contact
const contact = await client.contacts.get('id:123');
console.log(contact.firstName, contact.email);

// Send a message
await client.messaging.send('email:user@example.com', {
  message: {
    type: 'text',
    text: 'Hello from the SDK!',
  },
});
```

## Examples

This repository includes two example projects to demonstrate how to use the SDK in both a Node.js (JavaScript) and a TypeScript environment.

### Node.js Example

To run the Node.js example:

```bash
cd examples/nodejs-example
npm install
npm start
```

This will execute a simple test file that uses the SDK.

### TypeScript Example

To run the TypeScript example:

```bash
cd examples/typescript-example
npm install
npm start
```

This will compile and run a simple test file that uses the SDK.

## Authentication

To use the SDK, you need an API access token from your respond.io workspace:

1. Navigate to **Settings** > **Integrations** > **Developer API**
2. Click **Add Access Token** to generate a new token
3. Copy the token and use it to initialize the SDK

```typescript
const client = new RespondIO({
  apiToken: 'your-api-token-here',
  baseUrl: 'https://api.respond.io/v2', // Optional, defaults to this value
  maxRetries: 3, // Optional, defaults to 3
  timeout: 30000, // Optional, defaults to 30000ms
});
```

## API Reference

### Contacts

The Contact API allows you to manage contacts in your workspace.

#### Get a Contact

```typescript
const contact = await client.contacts.get('id:123');
// or
const contact = await client.contacts.get('email:user@example.com');
// or
const contact = await client.contacts.get('phone:+1234567890');
```

#### Create a Contact

```typescript
await client.contacts.create('email:user@example.com', {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  language: 'en',
  countryCode: 'US',
  custom_fields: [
    { name: 'Company', value: 'Acme Inc' },
    { name: 'Role', value: 'Developer' },
  ],
});
```

#### Update a Contact

```typescript
await client.contacts.update('id:123', {
  firstName: 'Jane',
  custom_fields: [{ name: 'Role', value: 'Senior Developer' }],
});
```

#### List Contacts

```typescript
// List all contacts
const result = await client.contacts.list({
  search: '',
  timezone: 'America/New_York',
  filter: { $and: [] },
});

// List with filters
const result = await client.contacts.list(
  {
    search: '',
    timezone: 'UTC',
    filter: {
      $and: [
        {
          category: 'contactField',
          field: 'assigneeUserId',
          operator: 'isEqualTo',
          value: '123',
        },
      ],
    },
  },
  {
    limit: 50,
    cursorId: 0,
  }
);
```

#### Manage Tags

```typescript
// Add tags
await client.contacts.addTags('id:123', ['vip', 'premium-customer']);

// Remove tags
await client.contacts.deleteTags('id:123', ['old-tag']);
```

### Messaging

The Messaging API allows you to send and retrieve messages.

#### Send Messages

```typescript
// Text message
await client.messaging.send('id:123', {
  message: {
    type: 'text',
    text: 'Hello! How can we help you today?',
  },
});

// Message with dynamic variables
await client.messaging.send('id:123', {
  message: {
    type: 'text',
    text: 'Hello {{$contact.name}}, your order #{{$contact.orderId}} is ready!',
  },
});

// Attachment
await client.messaging.send('id:123', {
  message: {
    type: 'attachment',
    attachment: {
      type: 'image',
      url: 'https://example.com/image.jpg',
    },
  },
});

// WhatsApp Template
await client.messaging.send('id:123', {
  channelId: 12345,
  message: {
    type: 'whatsapp_template',
    template: {
      name: 'order_confirmation',
      languageCode: 'en',
      components: [
        {
          type: 'body',
          text: 'Hello {{1}}, your order #{{2}} has been confirmed!',
          parameters: [
            { type: 'text', text: 'John' },
            { type: 'text', text: '12345' },
          ],
        },
      ],
    },
  },
});
```

#### Get a Message

```typescript
const message = await client.messaging.get('id:123', 987654);
console.log(message.status); // Message delivery status
```

#### List Messages

```typescript
// List all messages for a contact
const result = await client.messaging.list('id:123');
console.log(result.items); // Array of messages
console.log(result.pagination); // Pagination info

// List messages with pagination
const result = await client.messaging.list('id:123', {
  limit: 50,
  cursorId: 100,
});

// List messages for different contact identifiers
const result = await client.messaging.list('email:user@example.com');
const result = await client.messaging.list('phone:+1234567890', {
  limit: 20,
});
```

### Comments

The Comment API allows you to add internal comments to contacts.

#### Create a Comment

```typescript
await client.comments.create('id:123', {
  text: 'Customer requested a callback tomorrow at 2 PM',
});

// Mention users in comments
await client.comments.create('id:123', {
  text: 'Please follow up with this contact {{@user.456}}',
});
```

### Conversations

The Conversation API allows you to manage conversation status and assignments.

#### Assign/Unassign Conversations

```typescript
// Assign to user by ID
await client.conversations.assign('id:123', {
  assignee: 456,
});

// Assign to user by email
await client.conversations.assign('id:123', {
  assignee: 'agent@example.com',
});

// Unassign conversation
await client.conversations.assign('id:123', {
  assignee: null,
});
```

#### Open/Close Conversations

```typescript
// Open conversation
await client.conversations.updateStatus('id:123', {
  status: 'open',
});

// Close conversation with notes
await client.conversations.updateStatus('id:123', {
  status: 'close',
  category: 'Resolved',
  summary: 'Issue was resolved by providing documentation',
});
```

### Space (Workspace)

The Space API provides workspace-level operations.

#### List Users

```typescript
const users = await client.space.listUsers({ limit: 50 });
for (const user of users.items) {
  console.log(user.firstName, user.email, user.role);
}
```

#### Create Custom Field

```typescript
// Text field
await client.space.createCustomField({
  name: 'Customer ID',
  slug: 'customer_id',
  description: 'Unique customer identifier',
  dataType: 'text',
});

// List field with allowed values
await client.space.createCustomField({
  name: 'Priority',
  dataType: 'list',
  allowedValues: ['Low', 'Medium', 'High', 'Critical'],
});
```

#### List Channels

```typescript
const channels = await client.space.listChannels();
for (const channel of channels.items) {
  console.log(channel.name, channel.source);
}
```

#### Manage Tags

```typescript
// Create tag
await client.space.createTag({
  name: 'VIP Customer',
  description: 'High-value customers',
  colorCode: '#FF5733',
  emoji: '⭐',
});

// Update tag
await client.space.updateTag({
  currentName: 'VIP Customer',
  name: 'Premium Customer',
  colorCode: '#FFD700',
});

// Delete tag
await client.space.deleteTag({ name: 'Old Tag' });
```

## Error Handling

The SDK provides detailed error information through the `RespondIOError` class:

```typescript
import { RespondIOError } from '@respond-io/typescript-sdk';

try {
  await client.contacts.get('id:999999');
} catch (error) {
  if (error instanceof RespondIOError) {
    console.error('Status:', error.statusCode);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    // Check error type
    if (error.isRateLimitError()) {
      console.error('Rate limit reached!');
      console.error('Retry after:', error.rateLimitInfo?.retryAfter, 'seconds');
    } else if (error.isNotFoundError()) {
      console.error('Resource not found');
    } else if (error.isAuthError()) {
      console.error('Authentication failed');
    } else if (error.isValidationError()) {
      console.error('Invalid request parameters');
    } else if (error.isServerError()) {
      console.error('Server error occurred');
    }
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides complete type definitions:

```typescript
import type {
  Contact,
  Message,
  WhatsAppTemplateMessage,
  CustomField,
  SpaceUser,
} from '@respond-io/typescript-sdk';

// All API responses and requests are fully typed
const contact: Contact = await client.contacts.get('id:123');

// Type-safe message construction
const message: WhatsAppTemplateMessage = {
  type: 'whatsapp_template',
  template: {
    name: 'welcome_message',
    languageCode: 'en',
    components: [
      {
        type: 'body',
        text: 'Welcome {{1}}!',
        parameters: [{ type: 'text', text: 'John' }],
      },
    ],
  },
};
```

## Testing

The SDK includes comprehensive unit tests with 80%+ coverage:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure

```
tests/
├── setup.ts                    # Test configuration
├── client.test.ts             # HTTP client tests
├── errors.test.ts             # Error class tests
├── clients/
│   ├── contact.test.ts        # Contact client tests
│   ├── messaging.test.ts      # Messaging client tests
│   ├── comment-conversation-space.test.ts
└── integration/
    └── sdk.test.ts            # Integration tests
```

## Project Structure

```
respondio-sdk/
├── src/
│   ├── index.ts              # Main export
│   ├── client.ts             # HTTP client
│   ├── types/
│   │   ├── index.ts         # Type exports
│   │   ├── common.ts        # Common types
│   │   ├── contact.ts       # Contact types
│   │   ├── message.ts       # Message types
│   │   ├── space.ts         # Space types
│   │   ├── conversation.ts  # Conversation types
│   │   └── comment.ts       # Comment types
│   ├── clients/
│   │   ├── index.ts         # Client exports
│   │   ├── contact.ts       # Contact client
│   │   ├── messaging.ts     # Messaging client
│   │   ├── comment.ts       # Comment client
│   │   ├── conversation.ts  # Conversation client
│   │   └── space.ts         # Space client
│   └── errors/
│       └── index.ts         # Error classes
├── tests/                    # Test files
├── examples/                 # Usage examples
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Type check
npm run typecheck

# Run all validations
npm run validate
```

## Requirements

- Node.js 14+
- TypeScript 5.0+ (for TypeScript projects)
- Valid respond.io API access token

## Support

- **Documentation**: [https://developers.respond.io](https://developers.respond.io)
- **Help Center**: [https://respond.io/help](https://respond.io/help)
- **Contact Support**: [https://respond.io/contact](https://respond.io/contact)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ by the respond.io community
