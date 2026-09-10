# ConfessionBoard

Anonymous Confession Board - Create your own confession board and let others share their secrets with you.

<!--i need to put a image here!!!!!!!! help-->

## Features

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- PostgresSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/zinx28/ConfessionBoard.git
cd ConfessionBoard

# Install backend dependencies
cd backend
bun install

# Install frontend dependencies
cd ../frontend
bun install
```

### Environment Variables

**Frontend** - create a `.env` file (see `.env.example`)

**Backend** - create a `.env` file (see `.env.example`)

### Running Locally

```bash
# Make sure to configure before use
# Start the backend
cd backend
bun run dev

# In a separate terminal, start the frontend
cd frontend
bun run dev
```

The app should now be running at `http://127.0.0.1:3000` (frontend) with the API on `http://127.0.0.1:<port>`

## Contributing
This is a personal project, but issues and pull requests are welcome. Feel free to open an issue if you spot a bug or have a suggestion.

## License
[MIT](./LICENSE)