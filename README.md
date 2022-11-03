# einfach-schach

A chess app with focus on good UX for old people written in NextJS by students of the University of Applied Sciences Magdeburg

## How to use it?

Install main service:
```bash
git clone https://github.com/MTI-Schach-App/Einfach-Schach && cd einfach-schach && cd app
npm install
```

Use in development:
```bash
npm run dev
```

Use in production:
```bash
npm run build
npm run start
```

## How to use facerecognition?

If you want to enable face recognition within the app you need to have docker installed and run the following command:

Use in production:
```bash
cd facerecognition 
docker build -t facerec . 
docker run -dp 127.0.0.1:5000:3000 facerec
```

## How prep for commit?

Extras:
```bash
# Lint
npm run lint

# Prettier
npm run prettier
```

## Thanks to

Next.js - [Vercel with NextJS](https://nextjs.org/)
chess.js - [Chess.js](https://github.com/jhlywa/chess.js)
react-chessboard - [react-chessboard](https://github.com/Clariity/react-chessboard)
mui - [MaterialUI (MUI)](https://github.com/mui/material-ui)

