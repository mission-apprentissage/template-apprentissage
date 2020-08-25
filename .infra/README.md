# Déploiement

## Pré-requis

- Ansible 2.7+
- Vagrant 2.2+ (optionnel)
- VirtualBox 5+ (optionnel)
- Azure CLI 2.5+

## TL;DR

Des scripts Bash permettent de réaliser des actions sur l'infrastrucutre du projet :

- `create.sh` permet de créer une machine virtuelle sur Azure
- `setup.sh` permet de configurer la machine pour la convertir en environnement [TEMPLATE] (apt-get, users, app)
- `deploy.sh` permet uniquement de mettre à jour et déployer la partie applicative

L'application [TEMPLATE] est déployée sur deux environnements : `staging` et `production`.

Pour configurer le staging, il faut exécuter la commande :

```
bash setup.sh staging
```

Pour configurer la production, il faut exécuter la commande :

```
bash setup.sh production
```

## Création d'un nouvel environnement sous Azure (optionnel)

L'application Flux est déployée sur Microsoft Azure.

Pour créer un environnement sous Azure au sein d'une nouvelle VM Ubuntu,
il est possible d'utiliser l'interface graphique Azure (https://portal.azure.com/)
ou l'outil de ligne de commande Azure (Azure CLI).

En ligne de commande, pour créer un nouvel environnement il faut lancer :

```sh
az login
bash create.sh <nom de l''environnement (ex: staging)>
```

_Il est possible de configurer le nom de domaine en utilisant le paramètre `--dns` et spécifier la taille de la VM
avec le paramètre `--vm-size (valeurs possibles : 1,2,3)`._

Une fois l'environnement créé, l'environnement est automatiquement ajouté au fichier `ansible/env.ini` :

Il faut ensuite lancer le playbook Ansible :

```
bash setup.sh <nom_environnement> --user ansible
```

_Par défaut l'utilisateur `ansible` a le droit de sudo sans mot de passe.
Il faut entrer une chaine de caractères vide si Ansible le demande._

Une fois le playbook terminé, **il est nécessaire de demander à chaque utilisateur remote de changer son mot de passe**.
Il est également recommandé de supprimer l'utilisateur Ansible :

```sh
az vm user delete --username ansible \
    --name mna-<APP>-<ENV> \
    --resource-group mna-<APP>-<ENV>
```

L'application est disponible à l'url `http://<ENV>.francecentral.cloudapp.azure.com`.

## Tester les playbook Ansible

Il est possible de tester le playbook Ansible en utilisant Vagrant et VirtualBox.
Une fois ces deux outils installés, il faut lancer la commande :

```sh
cd ansible/test
bash run-playbook-tests.sh
```

Ce script va créer une machine virtuelle dans VirtualBox et exécuter le playbook sur cette VM.
Il est ensuite possible de se connecter à la machine via la commande :

```sh
vagrant ssh
```
