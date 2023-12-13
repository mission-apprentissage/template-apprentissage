# Clé GPG

## Installation

Installez [GnuPG](https://gnupg.org/download/)

> Sur OS X vous pouvez utiliser `brew install gnupg`

## Création de la Clé

Pour décrypter les variables d'environnement, vous avez besoin d'une clé GPG. Si vous n'en avez pas, vous pouvez en créer une en suivant la documentation GitHub [ici](https://docs.github.com/fr/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

Voici les étapes pour créer votre clé GPG :

1. Lors de la création de la clé, choisissez les options suivantes :

   - `Please select what kind of key you want` > `ECC (sign and encrypt)`
   - `Please select which elliptic curve you want` > `Curve 25519`
   - `Please specify how long the key should be valid` > `0`
   - `Real Name`: `<Prenom> <Nom>`
   - `Email Address`: `email@mail.gouv.fr`

2. Pour utiliser votre clé au sein du projet, publiez-la en exécutant la commande suivante :

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

   L'identifiant de votre clé correspond à la valeur `sec ed25519/<identifiant>`.

3. Pour utiliser votre clé au sein de la mission apprentissage, vous devez la publier en exécutant la commande suivante :

   ```bash
   gpg --send-key <identifiant>
   ```

4. Pour une meilleure sécurité, il est recommandé de sauvegarder les clés publique et privée nouvellement créées. Vous pouvez les exporter en exécutant les commandes suivantes :

   ```bash
   gpg --export <identifiant> > public_key.gpg
   gpg --export-secret-keys <identifiant> > private_key.gpg
   ```

   Ces deux fichiers peuvent être sauvegardés, par exemple, sur une clé USB.

5. Communiquez votre clé à votre équipe afin d'être autorisé à décrypter le vault.

**Une fois autorisé, vous aurez accès aux fichiers suivants :**

- `.infra/vault/.vault-password.gpg`

## Utilisation du capteur bio-metrique

Il est possible d'utiliser le capteur biometrique pour éviter de taper votre PIN à chaque utilisation.

Pour cela il faut installer le programme [pinentry](https://github.com/GPGTools/pinentry)

### OS X

En se basant sur le [tutoriel](https://medium.com/@jma/setup-gpg-for-git-on-macos-4ad69e8d3733)

Installez pinentry-mac `brew install pinentry-mac`

Ajouter pinentry à la config GPG: `echo "pinentry-program /opt/homebrew/bin/pinentry-mac" > ~/.gnupg/gpg-agent.conf`
