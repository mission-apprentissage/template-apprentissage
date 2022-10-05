# Template de projet

Permet de générér la partie applicative d'un projet.

Pour générer l'application, il faut lancer la commande :

```shell
bash generate.sh <le nom de l'application>
```

Le projet est ensuite disponible dans le répertoire `build`.
Vous pouvez alors créer un repository Github (`<le nom de l'application>`) et pusher ce projet

Si vous rencontrez un problème lors de la génération, il se peut que vous ayez une version de bash non compatible avec
le script.

Le plus simple est d'executer le script dans un container Docker.
Pour se faire, il faut créer à la racine du projet un fichier Dockerfile avec le contenu suivant

```
FROM alpine:3.14
RUN apk add --no-cache rsync bash
```

puis lancer les commandes suivantes :

```sh
   mkdir build
   docker build . -t mna-template 
   docker run -i -v $(pwd):/template \
   -e PUID="$(id -u)" -e PGID="$(id -g)" \
   mna-template bash -c 'cd /template && bash /template/generate.sh <le nom de l'application>'
```

Une fois le projet créé vous pouvez utiliser le template d'infrastructure de initiliaser la partie
infrastructure [https://github.com/mission-apprentissage/template-apprentissage](https://github.com/mission-apprentissage/template-apprentissage)


