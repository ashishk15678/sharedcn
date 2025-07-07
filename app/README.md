# sharedcn

## ⚠️ Notice

The CLI `setup-auth` command is currently **halted**. Please use only the `add` and `push` features for now. When using `push`, your components will be added with the `@public` prefix.

## Self-Hosting

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/sharedcn.git
   cd sharedcn/app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values.

4. **Run database migrations:**
   ```sh
   npx prisma migrate deploy
   # or
   npx prisma db push
   ```
5. **Start the server:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```

## CLI Usage

### Fetch Components (add)

Fetch one or more components by alias and write them to your project:

```sh
npx sharedcn add <alias1> <alias2> ...
```

- Components will be written to `components/custom/<alias>/`.
- Dependencies will be installed automatically.
- At the end, you'll see a summary of missing components and failed installs.

### Push Components (push)

Push a new component to the server (with `@public` prefix):

```sh
npx sharedcn push <file1> <file2> ... --name=<name> [--description=...] [--dependent=...]
```

- Example:

```sh
npx sharedcn push Button.tsx --name=@public/button --description="A button"
```

### Setup Auth (halted)

```sh
npx sharedcn setup-auth <token>
# This command is currently halted.
```

### Check Alias Availability

```sh
curl "https://yourdomain.com/api/components/check-alias?alias=@public/button"
```

### Get All Components

```sh
curl "https://yourdomain.com/api/components/all"
```

## API Endpoints

See `/docs/api` in your running app for full API documentation and examples.

## Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

## License

MIT
