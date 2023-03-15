# Solution

To implement the proposed requirements, I chose to use the NextJS framework since it allows me to work with databases in a simpler way, without having to create another separate project.

## Stack
React\
Typescript\
TailwindCSS\
Sass\
Prisma\
Sqlite

## Pipeline

1- Install the packages

```
yarn install
```

2- Prepare Database
```
npx prisma db push
```
3- Run app
```
yarn dev
```

Note to explore database you can run:
```
npx prisma studio
```
Hit http://localhost:3000 after `yarn dev` and thats all.




