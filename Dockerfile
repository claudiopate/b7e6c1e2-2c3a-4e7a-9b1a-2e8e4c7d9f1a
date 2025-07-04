FROM node:20-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di dipendenze
COPY package*.json ./

# Installa TUTTE le dipendenze (incluso TypeScript per il build)
RUN npm ci

# Copia il codice sorgente
COPY . .

# Compila il progetto TypeScript
RUN npm run build

# Rimuovi le dipendenze di sviluppo e il codice sorgente
RUN npm prune --production && \
    rm -rf src/ test/ .eslintrc.js tsconfig.json

# Crea un utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambia la proprietà dei file
RUN chown -R nodejs:nodejs /app
USER nodejs

# Espone la porta
EXPOSE 3000

# Comando di avvio
CMD ["node", "dist/src/index.js"] 