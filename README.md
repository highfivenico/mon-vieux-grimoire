# Mon vieux Grimoire Backend

## Comment lancer le projet ?

### Avec npm

Faites la commande `npm install` pour installer les dépendances puis `npm start` pour lancer le projet.

Faites la commande `npm install` pour installer les dépendances.
Puis `nodemon server` pour démarrer le serveur sur localhost à port 4000.

Pour connecter le projet à la base de données MongoDB, modifiez le fichier App.js en remplacant la ligne suivante :

"mongodb+srv://<identifiant>:<motdepasse>@cluster0.rw1cwcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

Par la ligne de connexion fournie dans le document PDF. Cette ligne contient les informations d'identification pour MongoDB (identifiant et mot de passe).
