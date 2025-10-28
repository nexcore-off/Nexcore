# Installation de MongoDB sur Ubuntu

## Option 1 : MongoDB Community Edition (Recommandé pour production)

```bash
# Importer la clé GPG
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Ajouter le dépôt MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Mettre à jour et installer
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier
mongod --version
```

## Option 2 : MongoDB via Docker (Plus simple)

```bash
# Installer Docker si nécessaire
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Lancer MongoDB dans un conteneur
sudo docker run -d \
  --name socialhub-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# MongoDB sera accessible sur localhost:27017
```

## Option 3 : MongoDB Atlas (Cloud - Gratuit)

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Obtenez votre URI de connexion
5. Modifiez le fichier `backend/.env` :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialhub
   ```

## Option 4 : Mode développement simplifié (Sans MongoDB)

J'ai créé une version simplifiée qui stocke les données en mémoire.
Voir `backend/server-simple.js`
