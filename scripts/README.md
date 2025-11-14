# Scripts

Utility scripts for the Deno web application.

## dump-passwords.ts

Dumps user passwords as bcrypt hashes with 12 rounds to a JSON file.

### Usage

```bash
deno task dump-passwords
```

### Output

Creates a `password-dump.json` file in the project root with the following structure:

```json
[
  {
    "email": "user@example.com",
    "name": "User Name",
    "plainPassword": "password123",
    "bcryptHash": "$2a$12$..."
  }
]
```

### Security Notes

⚠️ **IMPORTANT**: 
- The output file contains sensitive information
- Keep it secure and delete when no longer needed
- Never commit this file to version control (already in .gitignore)
- Use this only for migration or testing purposes

### Use Cases

- Migrating from plain text passwords to bcrypt
- Generating test data with hashed passwords
- Auditing password security
