### Équipe `3`

<dl>
<dt>Chef·fe projet</dt>
<dd>ZERU Simon</dd>
<dt>Membres</dt>
<dd>

- MONCENIX-LARUE Paul
- MALANDRINO Matis
- ROUSSELARD Jess
- BOUGHENDJOUR Rahim
- D'ETTORRE Yvan

</dd>

---

# SAÉ 3·01

L'application est disponible en ligne à l'adresse suivante : [https://chateau-tresor.vercel.app]

### Identifiants de connexion

Voici les identifiants de connexion pour les différents comptes de l'application (fonctionne en local et en ligne) et de Supabase :

#### Identifiants de connexion de l'application

1. **Compte organisateur**
   - login : testmembreequipe@chateautresor.com
   - mot de passe : 12345
2. **Compte propriétaire châteaux**
   - login : tesproprietairechateau@chateautresor.com
   - mot de passe : 12345
3. **Compte participant**
   - login : testparticipant@chateautresor.com
   - mot de passe : 12345

# Installation et exécution du projet en local

Suivez les étapes ci-dessous pour configurer et exécuter le projet sur votre machine Windows.

## Prérequis
Assurez-vous d'avoir une connexion internet active et les droits administratifs sur votre machine.

## Étapes d'installation

### 1. Installation des outils requis

1. **Installez Visual Studio Code (VSCode)**
   - Téléchargez et installez [VSCode](https://code.visualstudio.com/)

2. **Installez Git**
   - Téléchargez et installez [Git](https://git-scm.com/downloads)

3. **Installez Node.js**
   - Téléchargez et installez [Node.js](https://nodejs.org/en/download/current)

4. **Redémarrez votre PC**

### 2. Configuration de PowerShell

1. Ouvrez **Windows PowerShell** en mode administrateur (clic droit > "Exécuter en tant qu'administrateur").
2. Exécutez la commande suivante pour définir la politique d'exécution :
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
<img width="auto" alt="image" src="/screen/3.png">

### 3. Clonage du projet

1. Ouvrez **VSCode**.
2. Clonez le répertoire Git du projet via :
   ```bash
   git clone https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2024-s3/s3.01/team-03/rendus>
   ```
<img width="auto" alt="image" src="/screen/1.png">

### 4. Installation des dépendances

1. Ouvrez un terminal dans VSCode.
2. Exécutez la commande suivante pour installer les dépendances du projet :
   ```bash
   npm install --legacy-peer-deps
   ```

3. Mettez à jour npm à la dernière version 6 globalement :
   ```bash
   npm install -g npm@latest-6
   ```

4. Installez les dépendances essentielles pour le projet :
   ```bash
   npm install next react react-dom --legacy-peer-deps
   ```

### 5. Lancement du projet

1. Pour démarrer le projet en local, exécutez :
   ```bash
   npm run dev
   ```

2. Accédez à l'application en ouvrant votre navigateur sur :
   ```
   http://localhost:3000
   ```
<img width="auto" alt="image" src="/screen/4.png">

### 6. Lancement des tests

1. Pour exécuter les tests unitaires du projet, utilisez la commande suivante :
   ```bash
   npm run test
   ```
   Veillez que le serveur local est en route (voir l'étape 6)
---

Si vous rencontrez des problèmes, vérifiez que toutes les étapes ont été suivies correctement et consultez la documentation officielle des outils utilisés.

