
<% if (props.isBrowserify){ %>
Initialisation pour browserify
--------------------------------

Il faut configurer des symlinks pour que les paths de l'app resolvent dans node_modules (pour que browserify build)

ln -s ../app node_modules/app
ln -s ../app/lagrange node_modules/lagrange
ln -s ../app/<%= props.projectNamespace %> node_modules/<%= props.projectNamespace %>

<% } %>