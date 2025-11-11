# Respond.io TypeScript SDK - Project Structure

```
respondio-sdk/
├── src/
│   ├── index.ts                    # Main export
│   ├── client.ts                   # HTTP client
│   ├── types/
│   │   ├── index.ts               # Type exports
│   │   ├── common.ts              # Common types
│   │   ├── contact.ts             # Contact types
│   │   ├── message.ts             # Message types
│   │   ├── space.ts               # Space types
│   │   ├── conversation.ts        # Conversation types
│   │   └── comment.ts             # Comment types
│   ├── clients/
│   │   ├── index.ts               # Client exports
│   │   ├── contact.ts             # Contact client
│   │   ├── messaging.ts           # Messaging client
│   │   ├── comment.ts             # Comment client
│   │   ├── conversation.ts        # Conversation client
│   │   └── space.ts               # Space client
│   └── errors/
│       └── index.ts               # Error classes
├── tests/
│   ├── setup.ts                   # Test setup
│   ├── client.test.ts             # HTTP client tests
│   ├── clients/
│   │   ├── contact.test.ts        # Contact client tests
│   │   ├── messaging.test.ts      # Messaging client tests
│   │   ├── comment.test.ts        # Comment client tests
│   │   ├── conversation.test.ts   # Conversation client tests
│   │   └── space.test.ts          # Space client tests
│   └── integration/
│       └── sdk.test.ts            # Integration tests
├── examples/
│   └── index.ts                   # Usage examples
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

This structure provides:
- Clear separation of concerns
- Easy to navigate and maintain
- Scalable for future additions
- Better for tree-shaking
- Professional organization