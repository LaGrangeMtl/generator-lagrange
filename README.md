generator-lagrange
==================
![Header La Grange](http://clients.la-grange.ca/grange/grange_header.jpg "Header La Grange")

Scaffolding pour les projets de [La Grange](http://la-grange.ca "La Grange").

Compose la structure de base des projets chez La Grange. Contient donc la structure
des dossiers, ainsi que les principales dépendances JavaScript et LESS/CSS.

Pour installer le générateur yeoman de lagrange
-----------------------------------------------
* Cloner le projet de generateur et y aller dans la console 
	git clone https://github.com/LaGrangeMtl/lagrange-generator.git
	cd generator-lagrange
* Y mettre une référence dans node_modules :
	npm link
* Installer le générateur
	npm install -g generator-lagrange
* Après on peut scaffolder en faisant
	yo lagrange


Notes importantes
-----------------
* AVANT DE yo lagrange UN PROJET, PULLEZ POUR ÊTRE SUR D'AVOIR LA BONNE VERSION
* Le scaffolding a des dépendances gérées par Bower, notamment le framework frontend. Pour être certain d'avoir la bonne version du framework, ce dernier doit être à jour.
* Lors d'un commit, le faire le plus clair possible et mettre en détail les choses longues à expliquer dans le champ description pour qu'on puisse suivre les modifications facilement.
* Il est important de bien documenter chaque ajout et modification majeure à ce projet qui affecte le _workflow_ sur le [système de documentation](http://workflow.grange "Documentation workflow") prévu à cet effet.

Structure des dossiers
----------------------
##### /css
Fichiers .css seulement

***
##### /less
Le fichier master.less sera situé à la racine de ce dossier. Les autres fichiers .less sont disposés selon cette structure :

* _/common_ :

	Ici, les fichiers communs à tous les projets, ex: "responsive.less", "reset.less", etc.

* _/website_ :

	Ici, les fichiers spécifiques à chaque projet, ex: "basic.less", "header.less", etc.

***
##### /img
Fichiers images seulement

***
##### /assets
Fonts et sons

***
##### /js
Le fichier main.js (app.js si le projet utilise Require.js) sera situé à la racine de ce dossier. Les autres fichiers .js sont disposés selon cette structure :

* _/vendor_ :

	Ici, les snippets, librairies et classes dont le code source n'est pas propriété de La Grange. Même si une librairie est liscencié sous MIT ou autre liscence libre, elle doit être mise dans ce dossier par soucis de clarté.

* _/lagrange_ :

	Ici, les snippets, librairies et classes propres à La Grange.

* _/[nom de dossier relatif au projet]_ :

	Ici, le code et classes spécifiques au projet. 
