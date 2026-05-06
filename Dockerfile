FROM node:22-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS builder
ARG NEXT_PUBLIC_GA_ID=G-DTZE7QGLL2
ARG NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1238525237872219
ARG NEXT_PUBLIC_APP_URL=https://arcigy.com
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_FACEBOOK_PIXEL_ID=$NEXT_PUBLIC_FACEBOOK_PIXEL_ID
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
COPY app ./app
COPY automations ./automations
COPY components ./components
COPY core ./core
COPY lib ./lib
COPY public ./public
COPY next.config.ts postcss.config.js tsconfig.json ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=80
COPY --from=builder /app ./
EXPOSE 80
CMD ["sh", "-c", "npx prisma db push && npx next start"]
